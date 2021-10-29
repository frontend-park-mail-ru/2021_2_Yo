import SearchStatusComponent from './SearchStatus/SearchStatus.js';
import EventBoardComponent from './EventBoard/EventBoard.js';

export default class MainPageView {
    #parent: HTMLElement;
    #status?: SearchStatusComponent;
    #board?: EventBoardComponent;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = `
            <div id="search-status-wrapper"></div>
            <div id="event-board-wrapper"></div>
        `;    
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
