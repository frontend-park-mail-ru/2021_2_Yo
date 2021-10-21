import { EventCardData } from '../../../types.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class EventBoardComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.emit(Events.EventsReq);
        Bus.on(Events.EventsRes, this.#eventsHandle);
        Bus.on(Events.EventsError, this.#eventsError);
        this.#parent = parent;
    }

    #eventsHandle = ((data: EventCardData[]) => {
        this.render(data);
    }).bind(this);

    #eventsError = ((data: EventCardData[]) => {
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

    // rerender(data: EventCardData[]) {
    //     while (data.length < 13) {
    //         data.push(data[0]);
    //     }
    //     data = data.map(e => {
    //         e.description = 'Маскарат. Не советуем.';
    //         return e;
    //     });
    //     const source = `
    //         <div class="board">
    //             <div class="events">
    //                 {{#each this}}
    //                     <div class="events__e{{@index}} events__e-wrapper">
    //                         <img class="events__image" src="{{imgUrl}}">
    //                         <div class="events__content">
    //                             <span class="events__description">{{description}}</span>
    //                             <div class="events__viewed">
    //                                 <img src="./img/viewed2.0.png">
    //                                 <span class="events__viewed-score">{{viewed}}</span>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 {{/each}}
    //             </div>
    //         </div>
    //     `;
    //     const template: any = window.Handlebars.compile(source);
    //     this.#parent.innerHTML = template(data);
    // }

    // render() {
    //     this.#parent.innerHTML = `
    //         <div id="events-loader"><div>
    //     `;
    // }

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
    }
}
