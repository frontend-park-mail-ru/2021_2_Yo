import EventCardComponent from '../EventCard/EventCard.js';
import { EventCardData } from '../../types.js';

export default class EventRowComponent {
    #parent: HTMLElement;
    #data: EventCardData[];

    constructor(parent: HTMLElement, data: EventCardData[]) {
        this.#parent = parent;
        this.#data = data;
    }

    render() {
        const row = document.createElement('div');
        row.className = 'eventRow';
        this.#data.map((data) => {
            const event = new EventCardComponent(row, data);
            event.render();
        });
        this.#parent.innerHTML += row.outerHTML;
    }
}
