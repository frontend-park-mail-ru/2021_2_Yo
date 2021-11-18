import * as template from '@main-page/mainpage.hbs';
// import SearchStatusComponent from '@main-page/SearchStatus/SearchStatus';
import CategoriesBarComponent from '@main-page/CategoriesBar/CategoriesBar';
import EventBoardComponent from '@main-page/EventBoard/EventBoard';

export default class MainPageView {
    #parent: HTMLElement;
    // #status?: SearchStatusComponent;
    #categories?: CategoriesBarComponent;
    #board?: EventBoardComponent;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(params?: number) {
        this.#parent.innerHTML = template();
        // const ssWrapper = <HTMLElement>document.getElementById('search-status-wrapper');
        const cbWrapper = <HTMLElement>document.getElementById('categories-bar-wrapper');
        const ebWrapper = <HTMLElement>document.getElementById('event-board-wrapper');

        // this.#status = new SearchStatusComponent(ssWrapper);
        this.#categories = new CategoriesBarComponent(cbWrapper);
        this.#board = new EventBoardComponent(ebWrapper);

        // this.#status.render();
        this.#categories.render(params);
        this.#board.render();
    }

    disable() {
        this.#board?.disable();
        this.#categories?.disable();
        // this.#status?.disable();
        this.#parent.innerHTML = '';
    }
}
