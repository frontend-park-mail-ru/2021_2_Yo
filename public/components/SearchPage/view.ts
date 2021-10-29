import SearchBoard from './SearchBoard/SearchBoard.js';
import SideBar from './SideBar/SideBar.js';

interface InputData {
    category?: number,
    tags?: Array<string>,
}

export default class SearchPageView {
    #parent: HTMLElement;
    #search?: SearchBoard; 
    #side?: SideBar; 
    
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    filter(data: InputData) {
        this.#side?.renderFilter(data.category, data.tags);
    }

    render() {
        const source = `
            <div class="wrapper-center wrapper__top_forty">
                <div class="content">
                    <div id="search-board-wrapper"></div>
                    <div id="side-bar-wrapper"></div>
                </div>
            </div>
        `;
        this.#parent.innerHTML = window.Handlebars.compile(source)();

        const search = <HTMLElement>document.getElementById('search-board-wrapper');
        const side = <HTMLElement>document.getElementById('side-bar-wrapper');

        this.#search = new SearchBoard(search);
        this.#side = new SideBar(side);
        this.#search.render();
        this.#side.render();
    }

    disable() {
        this.#search?.disable();
        this.#side?.disable();
        this.#parent.innerHTML = '';
    }
}
