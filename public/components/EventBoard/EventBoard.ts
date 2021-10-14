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
        const source = `
            <div class="events">
                {{#each events}}
                    <div class="e{{index}}">
                        <img src="{{imgUrl}}">
                    </div>
                {{/each}}
            </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(this.#data);
    }
}
