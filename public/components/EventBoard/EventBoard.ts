// import EventRowComponent from '../EventRow/EventRow.js';
import { EventCardData } from '../../types.js';

// export default class EventBoardComponent {
//     #parent: HTMLElement
//     #data: EventCardData[]

//     constructor(parent: HTMLElement, data: EventCardData[]) {
//         this.#parent = parent;
//         this.#data = data;
//     }

//     render() {
//         const board = document.createElement('div');
//         board.className = 'eventBoard';
//         for (let i = 0; i < this.#data.length; i += 3) {
//             const temp = this.#data.slice(i, i + 3);
//             const row = new EventRowComponent(board, temp);
//             row.render();
//         }
//         this.#parent.innerHTML += board.outerHTML;
//     }
// }

export default class EventBoardComponent {
    #parent: HTMLElement
    #data: EventCardData[]

    constructor(parent: HTMLElement, data: EventCardData[]) {
        this.#parent = parent;
        this.#data = data;
    }

    render() {
        // const board = document.createElement('div');
        // board.className = 'events';
        // for (let i = 0; i < this.#data.length; i += 3) {
        //     const temp = this.#data.slice(i, i + 3);
        //     const row = new EventRowComponent(board, temp);
        //     row.render();
        // }
        while (this.#data.length < 13) {
            this.#data.push(this.#data[0])
        }
        this.#data = this.#data.map(e => {
            e.description = 'Маскарад. Прикольно и весело.'
            return e
        });
        const source = `
            <div class="board">
                <div class="events">
                    {{#each this}}
                        <div class="events__e{{@index}} events__e-wrapper">
                            <img class="events__image" src="{{imgUrl}}">
                            <span class="events__description">{{description}}</span>
                            <div class="events__viewed">
                                <img src="./img/viewed2.0.png">
                                <span class="events__viewed-score">{{viewed}}</span>
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
