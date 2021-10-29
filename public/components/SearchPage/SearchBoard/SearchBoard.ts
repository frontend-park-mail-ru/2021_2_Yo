import { EventData, UrlPathnames } from '../../../types.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class SearchBoard {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        Bus.on(Events.EventsRes, this.#handleEvents);
        Bus.on(Events.EventsError, this.#handleEventsError);
        Bus.emit(Events.EventsReq);

        const list = `
            <div id="events-list">
            {{#each events}}
                <div class="event-li">
                    <div class="event-li__img bg-img-wrapper">
                        <img class="bg-img" src="{{imgUrl}}">
                    </div>
                    <div class ="event-li__content">
                        <span id="event-{{@index}}" class="event-li__title" data-id="{{id}}">{{title}}</span>
                        <div class="event-li__description">{{description}}</div>
                        <div class="event-li__info event-li__description">
                            <div class="event-li__description">
                                <span>Когда:&nbsp;</span>
                                <span class="text_date">{{date}}</span>
                                <span>Где:&nbsp;</span>
                                <span class="text_geo">{{geo}}</span>
                            </div>
                            <div class="event-li__viewed">
                                <img class="event-li__viewed-img" src="/img/viewed2.png">
                                <span>{{viewed}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            {{/each}}
            </div>
        `;

        window.Handlebars.registerPartial('events-list', list);
    }

    #handleEvents = ((events: EventData[]) => {
        if (events.length > 0) {
            this.render(events);
        } else {
            this.#renderEmpty();
        }
    }).bind(this);

    #handleEventsError = (() => {
        this.#renderError();
    }).bind(this);

    #renderError() {
        const source = `
            <h2>Бекендеры решили ПОТУСИТЬ => API отъехало.</h2>
        `;
        const content = <HTMLElement>document.getElementById('search-content');
        content.innerHTML = window.Handlebars.compile(source)();
    }

    #renderEmpty() {
        const source = `
            <h2>Прости бро, нет таких ивентосов</h2>
        `;
        const content = <HTMLElement>document.getElementById('search-content');
        content.innerHTML = window.Handlebars.compile(source)();
    }

    #addListeners() {
        for (let i = 0;; i++) {
            const event = <HTMLElement>document.getElementById('event-' + i.toString());
            if (!event) break;

            event.addEventListener('click', this.#handleEventClick);
        }
    }

    #handleEventClick = (e: MouseEvent) => {
        const target = <HTMLElement>e.target;
        const id = <string>target.dataset['id'];
        Bus.emit(Events.RouteUrl, UrlPathnames.Event + '?id=' + id.toString());
    };

    render(events?: EventData[]) {
        const source = `
            <div class="search-bar">
                <input class="search-bar__input border-box_color_gray" placeholder="Например: отвисная и отвязная..."></input>
                <div class="search-bar__geo border-box_color_gray text_geo">Москва</div>
            </div>
            <div id="search-content">
                {{#if events}}
                {{> events-list this}}
                {{else}}
                <div class="loader-wrapper">
                    <img class="loader loader_size_s" src="/img/logo.png">
                </div>
                {{/if}}
            </div>
        `;
        this.#parent.innerHTML = window.Handlebars.compile(source)({events: events});
        this.#addListeners();
    }

    #removeListeners() {
        for (let i = 0;; i++) {
            const event = <HTMLElement>document.getElementById('event-' + i.toString());
            if (!event) break;

            event.removeEventListener('click', this.#handleEventClick);
        }
    }

    disable() {
        this.#removeListeners();
        Bus.off(Events.EventsRes, this.#handleEvents);
        Bus.off(Events.EventsError, this.#handleEventsError);
        this.#parent.innerHTML = '';
    }
}
