import * as template from '@main-page/FilterList/filterlist.hbs';
import '@main-page/FilterList/FilterList.css';
import { FilterData } from '@/types';
import config from '@/config';

export default class FilterListComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(params?: FilterData) {
        this.#parent.innerHTML = template(config.categories);
    }

    disable() {
        this.#parent.innerHTML = '';
    }
}
