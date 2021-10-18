import { EventCardData } from '../../types.js';

export default class EventBoardComponent {
    #parent: HTMLElement
    #data: EventCardData[]

    constructor(parent: HTMLElement, data: EventCardData[]) {
        this.#parent = parent;
        this.#data = data;
    }

    render() {
        while (this.#data.length < 13) {
            this.#data.push(this.#data[0])
        }
        this.#data = this.#data.map(e => {
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
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(this.#data);
    }
}
