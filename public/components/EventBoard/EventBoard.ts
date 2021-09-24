import { EventCardData } from "../EventCard/EventCard.js"
import EventRowComponent from "../EventRow/EventRow.js";

export default class EventBoardComponent {
    #parent: HTMLElement
    #data: EventCardData[]

    constructor(parent: HTMLElement, data: EventCardData[]) {
        this.#parent = parent;
        this.#data = data;
    }

    render() {
        const board = document.createElement('div');
        board.className = 'eventBoard';
        for (let i = 0; i < this.#data.length; i += 3) {
            const temp = this.#data.slice(i, i + 3);
            const row = new EventRowComponent(board, temp);
            row.render();
        }
        this.#parent.innerHTML += board.outerHTML;
    }
}
