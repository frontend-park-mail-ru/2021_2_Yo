import HeaderComponent from '../Header/Header.js';
import { EventCardData, UserData } from '../../types.js'
import EventBoardComponent from '../EventBoard/EventBoard.js';
import SearchStatus from '../SearchStatus/SearchStatus.js';
import EventHeaderComponent from '../EventHeader/EventHeader.js';
import FilterHeaderComponent from '../FilterHeader/FilterHeader.js';
import MainHeaderComponent from '../MainHeader/MainHeader.js';
import SearchStatusComponent from '../SearchStatus/SearchStatus.js';

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
        // const mHeader = new MainHeaderComponent(this.#parent, this.#user);
        // const eHeader = new EventHeaderComponent(this.#parent);
        // const fHeader = new FilterHeaderComponent(this.#parent);
        const Header = new HeaderComponent(this.#parent, this.#user)
        const status = {
            question: 'Где потусить ',
            when: 'сегодня',
            link: ' в ',
            city: 'Москве',
        }
        const SearchStatus = new SearchStatusComponent(this.#parent, status)
        const eBoard = new EventBoardComponent(this.#parent, this.#events);

        // mHeader.render();
        // eHeader.render();
        // fHeader.render();
        Header.render();
        SearchStatus.render();
        eBoard.render();
    }
}
