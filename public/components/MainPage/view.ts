import FilterListComponent from '@/components/MainPage/FilterList/FilterList';
import EventBoardComponent from '@main-page/EventBoard/EventBoard';
import * as template from '@main-page/mainpage.hbs';
import '@main-page/MainPage.css';

const GO_TOP_HEIGHT_PROPORTION = 0.5;

export default class MainPageView {
    #parent: HTMLElement;
    #filterlist?: FilterListComponent;
    #board?: EventBoardComponent;
    #gotop?: HTMLElement;
    #gotopShown: boolean;
    #filterButton?: HTMLElement;
    #filterShown: boolean;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        this.#filterShown = false;
        this.#gotopShown = false;
    }

    #addListeners() {
        if (this.#gotop) {
            window.addEventListener('scroll', this.#handleScroll);
            this.#gotop.addEventListener('click', this.#handleGoTop);
        }

        if (this.#filterButton) {
            this.#filterButton.addEventListener('click', this.#handleFilterButton);
        }
    }

    #handleFilterButton = () => {
        const wrapper = <HTMLElement>document.getElementById('filter-list-wrapper');
        if (!wrapper) return;
        if (this.#filterShown) {
            wrapper.classList.add('filter-list_hidden');
            wrapper.classList.remove('filter-list_shown');
        } else {
            wrapper.classList.add('filter-list_shown');
            wrapper.classList.remove('filter-list_hidden');
        }
        this.#filterShown = !this.#filterShown;
    };

    #handleScroll = () => {
        if (!this.#gotop) return;
        if (window.scrollY > (document.documentElement.clientHeight * GO_TOP_HEIGHT_PROPORTION)) {
            if (!this.#gotopShown) {
                this.#gotop.classList.remove('gotop_hidden');
                this.#gotop.classList.add('gotop_shown');
                this.#gotopShown = true;
            }
        } else {
            if (this.#gotopShown) {
                this.#gotop.classList.remove('gotop_shown');
                this.#gotop.classList.add('gotop_hidden');
                this.#gotopShown = false;
            }
        }
    };

    #handleGoTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    #removeListeners() {
        if (this.#gotop) {
            window.removeEventListener('scroll', this.#handleScroll);
            this.#gotop.removeEventListener('click', this.#handleGoTop);
        }
        if (this.#filterButton) this.#filterButton.removeEventListener('click', this.#handleFilterButton);
    }

    render() {
        this.#parent.innerHTML = template();
        const flWrapper = <HTMLElement>document.getElementById('filter-list-wrapper');
        const ebWrapper = <HTMLElement>document.getElementById('event-board-wrapper');
        this.#gotop = <HTMLElement>document.getElementById('gotop');
        this.#filterButton = <HTMLElement>document.getElementById('filter-button');

        this.#filterlist = new FilterListComponent(flWrapper);
        this.#board = new EventBoardComponent(ebWrapper);

        this.#board.render();
        this.#filterlist.render();
        this.#addListeners();
    }

    disable() {
        this.#board?.disable();
        this.#filterlist?.disable();
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
