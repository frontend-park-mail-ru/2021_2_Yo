import { EventCardData } from '../../../types.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class EventBoardComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.emit(Events.EventsReq, undefined);
        Bus.on(Events.EventsRes, this.#eventsHandle);
        this.#parent = parent;
    }

    #eventsHandle = ((data: EventCardData[]) => {
        this.rerender(data);
    }).bind(this);

    rerender(data: EventCardData[]) {
        while (data.length < 13) {
            data.push(data[0]);
        }
        data = data.map(e => {
            e.description = 'Маскарат. Не советуем.';
            return e;
        });
        const source = `
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
        `;
        const template: any = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(data);
    }

    render() {
        this.#parent.innerHTML = `
            <div id="loader"><div>
        `;
    }

    disable() {
        Bus.off(Events.EventsRes, this.#eventsHandle);
    }
}
