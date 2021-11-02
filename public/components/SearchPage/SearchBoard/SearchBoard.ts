import { EventData } from '@/types.js';
import Bus from '@eventbus/eventbus.js';
import Events from '@eventbus/events.js';
import * as errorTemplate from '@search-page/SearchBoard/eventerror.hbs';
import * as listTemplate from '@search-page/SearchBoard/eventlist.hbs';
import * as template from '@search-page/SearchBoard/searchboard.hbs';
import '@search-page/SearchBoard/SearchBoard.css';

export default class SearchBoard {
    #parent: HTMLElement;
    #query?: string;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        Bus.on(Events.EventsRes, this.#handleEvents);
        Bus.on(Events.EventsError, this.#handleEventsError);

        // const list = `
        //     {{#if events}}
        //         <div id="events-list">
        //         {{#each events}}
        //             <div class="event-li">
        //                 <div class="event-li__img bg-img-wrapper">
        //                     <img class="bg-img" src="{{imgUrl}}">
        //                 </div>
        //                 <div class ="event-li__content">
        //                     <a class="event-li__title" href="/events?id={{id}}">{{title}}</a>
        //                     <div class="event-li__description">{{description}}</div>
        //                     <div class="event-li__info event-li__description">
        //                         <div class="event-li__description">
        //                             <span>Когда:&nbsp;</span>
        //                             <span class="text_date">{{date}}</span>
        //                             <span>Где:&nbsp;</span>
        //                             <span class="text_geo">{{geo}}</span>
        //                         </div>
        //                         <div class="event-li__viewed">
        //                             <img class="event-li__viewed-img" src="/img/viewed2.png">
        //                             <span>{{viewed}}</span>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         {{/each}}
        //         </div>
        //     {{else}}
        //         <h2>Прости бро, нет таких ивентосов</h2>
        //     {{/if}}
        // `;

        // window.Handlebars.registerPartial('events-list', list);
    }

    #handleEvents = ((events: EventData[]) => {
        this.#renderEvents(events);
    }).bind(this);

    #handleEventsError = (() => {
        this.#renderError();
    }).bind(this);

    #renderError() {
        // const source = `
        //     <h2>Бекендеры решили ПОТУСИТЬ => API отъехало.</h2>
        // `;
        const content = <HTMLElement>document.getElementById('search-content');
        // content.innerHTML = window.Handlebars.compile(source)();
        content.innerHTML = errorTemplate();
    }

    #renderEvents(events: EventData[]) {
        // const source = `
        //     {{> events-list this}}
        // `;

        const content = <HTMLElement>document.getElementById('search-content');
        // content.innerHTML = window.Handlebars.compile(source)({events: events});
        content.innerHTML = listTemplate({events: events});
    }

    renderQuery(query: string | undefined) {
        if (!query) query = '';
        this.#query = query;
        const input = <HTMLInputElement>document.getElementById('query-input');
        if (input) input.value = query;
    }

    addListeners() {
        const input = <HTMLInputElement>document.getElementById('query-input');
        if (!input) return;
        input.addEventListener('input', this.#handleInput);
    }

    #handleInput = ((e: Event) => {
        const input = <HTMLInputElement>e.target;
        if (!input) return;
        this.#query = input.value;

        const handle = ((query: string | undefined) => {
            if (!query) query = '';
            if (query === this.#query) {
                Bus.emit(Events.QueryChange, query);
            }
        }).bind(this);     
        setTimeout(handle, 500, this.#query);
    }).bind(this);

    removeListeners() {
        const input = <HTMLInputElement>document.getElementById('query-input');
        if (!input) return;
        input.addEventListener('input', this.#handleInput);
    }

    render() {
        // const source = `
        //     <div class="search-bar">
        //         <input id="query-input" class="search-bar__input border-box_color_gray" 
        //                                 placeholder="Например: отвисная и отвязная...">
        //         </input>
        //         <div class="search-bar__geo border-box_color_gray text_geo">Москва</div>
        //     </div>
        //     <div id="search-content">
        //         <div class="loader-wrapper">
        //             <img class="loader loader_size_s" src="/img/logo.png">
        //         </div>
        //     </div>
        // `;
        // this.#parent.innerHTML = window.Handlebars.compile(source)();
        this.#parent.innerHTML = template();
        this.addListeners();
    }

    disable() {
        this.removeListeners();
        Bus.off(Events.EventsRes, this.#handleEvents);
        Bus.off(Events.EventsError, this.#handleEventsError);
        this.#parent.innerHTML = '';
    }
}
