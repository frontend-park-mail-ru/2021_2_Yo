import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import * as categoriesTemplate from '@main-page/CategoriesBar/categoriesbar.hbs';
import '@main-page/CategoriesBar/CategoriesBar.css';
import { FilterData } from '@/types';

export default class CategoriesBarComponent {
    #parent: HTMLElement;
    #category?: number;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    #addEventListeners() {
        for (let i = 0; i < config.categories.length; i++) {
            const categoryElem = <HTMLElement>document.getElementById('category-' + i.toString());
            if (categoryElem) categoryElem.addEventListener('click', this.#handleCategoryClick);
        }
    }

    #removeEventListeners() {
        for (let i = 0; i < config.categories.length; i++) {
            const categoryElem = <HTMLElement>document.getElementById('category-' + i.toString());
            if (categoryElem) categoryElem.addEventListener('click', this.#handleCategoryClick);
        }
    }

    #handleCategoryClick = (e: MouseEvent) => {
        const target = <HTMLElement>e.currentTarget;
        const num = +<string>target.dataset['num'];
        if (this.#category == num) {
            target.classList.remove('categories-bar-elem_checked');
            this.#category = undefined;
        } else {
            if (this.#category !== undefined) {
                const prevTarget = <HTMLElement>document.getElementById('category-' + this.#category?.toString());
                prevTarget.classList.remove('categories-bar-elem_checked');
            }
            target.classList.add('categories-bar-elem_checked');
            this.#category = num;
        }

        Bus.emit(Events.FilterChange, {category: this.#category});
    };

    render(params?: number) {
        this.#category = params;
        this.#parent.innerHTML = categoriesTemplate(config.categories);
        if (params !== undefined) {
            const category = <HTMLElement>document.getElementById('category-' + this.#category);
            category.classList.add('categories-bar-elem_checked');
        }
        Bus.emit(Events.FilterChange, {category: this.#category});
        this.#addEventListeners();    
    }

    disable() {
        this.#removeEventListeners();    
        this.#parent.innerHTML = '';
    }
}
