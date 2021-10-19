import { EventCardData } from '../../types.js';
import bus, {Events} from '../../modules/eventbus.js';

export default class EventBoardComponent {
    #parent: HTMLElement;
    // #data: EventCardData[]

    // constructor(parent: HTMLElement, data: EventCardData[]) {
    constructor(parent: HTMLElement) {
        this.#parent = parent;
        bus.on(Events.EventsGet, ((data: EventCardData[]) => {this.render(data);}).bind(this));
        // this.#data = data;
    }

    // reRender(data: EventCardData[]) {
        
    // }

    render(data: EventCardData[]) {
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
}
