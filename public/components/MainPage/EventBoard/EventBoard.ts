import { EventCardData } from '../../../types';
import Bus from '../../../modules/eventbus/eventbus';
import Events from '../../../modules/eventbus/events';

export default class EventBoardComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.on(Events.EventsRes, this.#eventsHandle);
        Bus.on(Events.EventsError, this.#eventsError);
        Bus.emit(Events.EventsReq);
        this.#parent = parent;
    }

    #eventsHandle = ((data: EventCardData[]) => {
        this.render(data);
    }).bind(this);

    #eventsError = (() => {
        this.error();
    }).bind(this);

    error() {
        const source = `
            <div id="events-error">
                <p>Чтобы восстановить пароль, подготовьте номер<br>
                public static java.lang.Object ru.tinkoffabsense.AEF(<br>
                java.lang.Boolean,<br>
                java.lang.Object,<br>
                java.lang.Object);<br>
                0 == 1 кредитного договора банковской карты. Под рукой ли он у вас?</p>
                <br>
                <p>
                Кароче апи отъехало.
                </p>
            </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template();
    }

    render(data?: EventCardData[]) {
        // Временные меры (пока не хотим контактировать с беком)
        if (data) {
            while (data.length < 13) {
                data.push(data[0]);
            }
            data = data.map(e => {
                e.description = 'Маскарат. Не советуем.';
                return e;
            });
        }
        
        const source = `
            {{#if this}}
            <div class="board">
                <div class="events">
                    {{#each this}}
                    <div class="events__e{{@index}} events__e-wrapper">
                        <img class="events__image" src="{{imgUrl}}">
                        <div class="events__content">
                            <span class="events__description">{{description}}</span>
                            <div class="events__viewed">
                                <img src="./img/viewed2.0.png">
                                <span class="events__viewed-score">{{viewed}}</span>
                            </div>
                        </div>
                    </div>
                    {{/each}}
                </div>
            </div>                   
            {{else}}
            <div id="events-loader"><div>
            {{/if}}
        `;
        const template: any = window.Handlebars.compile(source);
        this.#parent.innerHTML = template(data);
    }

    disable() {
        Bus.off(Events.EventsRes, this.#eventsHandle);
        Bus.off(Events.EventsError, this.#eventsError);

        this.#parent.innerHTML = '';
    }
}
