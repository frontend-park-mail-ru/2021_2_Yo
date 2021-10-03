import { EventCardData, UserData } from '../../types.js'
import EventBoardComponent from '../EventBoard/EventBoard.js';
import EventHeaderComponent from '../EventHeader/EventHeader.js';
import FilterHeaderComponent from '../FilterHeader/FilterHeader.js';
import MainHeaderComponent from '../MainHeader/MainHeader.js';

export default class MainPageComponent {
    #parent: HTMLElement
    #events: EventCardData[]
    #user: UserData | undefined

    constructor(parent: HTMLElement, events: EventCardData[], user?: UserData) {
        this.#parent = parent;
        this.#events = events;
        this.#user = user;
    }

    render() {
        const mHeader = new MainHeaderComponent(this.#parent, this.#user);
        const eHeader = new EventHeaderComponent(this.#parent);
        const fHeader = new FilterHeaderComponent(this.#parent);
        const eBoard = new EventBoardComponent(this.#parent, this.#events);

        mHeader.render();
        eHeader.render();
        fHeader.render();
        eBoard.render();
    }
}
