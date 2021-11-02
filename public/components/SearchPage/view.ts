import SearchBoard from '@search-page/SearchBoard/SearchBoard';
import SideBar from '@search-page/SideBar/SideBar';
import * as template from '@search-page/searchpage.hbs';

interface FilterData {
    category?: number,
    tags: Array<string>,
    query?: string,
}

export default class SearchPageView {
    #parent: HTMLElement;
    #search?: SearchBoard; 
    #side?: SideBar; 
    
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    filter(data: FilterData) {
        this.#side?.renderFilter(data.category, data.tags);
        this.#search?.renderQuery(data.query);
    }

    render() {
        this.#parent.innerHTML = template();

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
