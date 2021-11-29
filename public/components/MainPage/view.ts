// import SearchStatusComponent from '@main-page/SearchStatus/SearchStatus';
// import CategoriesBarComponent from '@main-page/CategoriesBar/CategoriesBar';
import FilterListComponent from '@/components/MainPage/FilterList/FilterList';
import EventBoardComponent from '@main-page/EventBoard/EventBoard';
import { FilterData } from '@/types';
import * as template from '@main-page/mainpage.hbs';
import '@main-page/MainPage.css';

export default class MainPageView {
    #parent: HTMLElement;
    // #status?: SearchStatusComponent;
    #filterlist?: FilterListComponent;
    #board?: EventBoardComponent;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = template();
        // const ssWrapper = <HTMLElement>document.getElementById('search-status-wrapper');
        const flWrapper = <HTMLElement>document.getElementById('filter-list-wrapper');
        const ebWrapper = <HTMLElement>document.getElementById('event-board-wrapper');

        // this.#status = new SearchStatusComponent(ssWrapper);
        this.#filterlist = new FilterListComponent(flWrapper);
        this.#board = new EventBoardComponent(ebWrapper);

        // this.#status.render();
        this.#board.render();
        this.#filterlist.render();
    }

    disable() {
        this.#board?.disable();
        this.#filterlist?.disable();
        // this.#status?.disable();
        this.#parent.innerHTML = '';
    }
}
