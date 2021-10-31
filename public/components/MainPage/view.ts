import * as template from '@main-page/mainpage.hbs';
import SearchStatusComponent from '@main-page/SearchStatus/SearchStatus';
import EventBoardComponent from '@main-page/EventBoard/EventBoard';

export default class MainPageView {
    #parent: HTMLElement;
    #status?: SearchStatusComponent;
    #board?: EventBoardComponent;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = template();
        const ssWrapper = document.getElementById('search-status-wrapper') as HTMLElement;
        const ebWrapper = document.getElementById('event-board-wrapper') as HTMLElement;

        this.#status = new SearchStatusComponent(ssWrapper);
        this.#board = new EventBoardComponent(ebWrapper);

        this.#status.render();
        this.#board.render();
    }

    disable() {
        this.#board?.disable();
        this.#status?.disable();
        this.#parent.innerHTML = '';
    }
}
