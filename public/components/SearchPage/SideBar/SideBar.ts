import config from '../../../config.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class SideBar {
    #parent: HTMLElement;
    #categoriesOpened: boolean;
    #category?: number;
    #tags: Array<string> = [];

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        this.#categoriesOpened = false;
        const tag = `
            <label id="tag-{{this}}" class="tags__tag">
                {{this}}
            </label>
        `;
        window.Handlebars.registerPartial('tag', tag);
    }

    #addListeners() {
        const img = <HTMLElement>document.getElementById('categories-img');
        if (img) {
            img.addEventListener('click', this.#handleCategoryList);
        }

        const button = <HTMLElement>document.getElementById('tags-button');
        if (button) {
            button.addEventListener('click', this.#handleTagAddClick);
        }

        const input = <HTMLInputElement>document.getElementById('tags-input');
        if (input) {
            input.addEventListener('keydown', this.#handleTagAddEnter);
        }

        config.categories.map((_, i) => {
            const category = <HTMLElement>document.getElementById('category-' + i.toString());
            if (!category) return;

            category.addEventListener('click', this.#handleCategory);
        });
    }

    #handleCategory = (e: MouseEvent) => {
        const target = <HTMLElement>e.target;
        const index = +<string>target.dataset?.num;
        if (index === this.#category) {
            target.style.backgroundColor = '';
            this.#category = undefined;
        } else {
            if (this.#category !== undefined) {
                const cat = <HTMLElement>document.getElementById('category-' + this.#category);
                cat.style.backgroundColor = '';
            }
            target.style.backgroundColor = 'var(--category-check)';
            this.#category = index;
        }
        this.#handleFilter(this.#category, this.#tags);
    };

    #handleCategoryList = (e: MouseEvent) => {
        const target = <HTMLElement>e.target;
        const list = <HTMLElement>document.getElementById('categories-list');
        if (!list) return;

        if (this.#categoriesOpened) {
            target.style.transform = 'rotate(0deg)';
            list.style.maxHeight = '0';
        } else {
            target.style.transform = 'rotate(90deg)';
            list.style.maxHeight = '100vh';
        }
        this.#categoriesOpened = !this.#categoriesOpened;
    };

    #handleTagDelete = (e: MouseEvent) => {
        const target = <HTMLLabelElement>e.target;
        if (!target) return;
        this.#tags = this.#tags.filter(tag => tag !== target.innerText);
        target.removeEventListener('click', this.#handleTagDelete);
        target.outerHTML = '';
        this.#handleFilter(this.#category, this.#tags);
    };

    #tagAdd(input: HTMLInputElement) {
        if (this.#tags.indexOf(input.value) !== -1) {
            const repeated = <HTMLLabelElement>document.getElementById('tag-' + input.value);
            if (repeated) {
                repeated.style.backgroundColor = 'red';
                setTimeout(() => repeated.style.backgroundColor = '', 500);
            }
            return;
        }

        const list = <HTMLElement>document.getElementById('tags-list');
        if (!(list)) return;

        this.#tags.map((t) => {
            const categ = <HTMLElement>document.getElementById('tag-' + t);
            if (categ) {
                categ.removeEventListener('click', this.#handleTagDelete);
            }
        });

        list.innerHTML = '';
        this.#tags.push(input.value);
        this.#tags.map((t) => {
            const tag = `
                {{> tag this}}
            `;
            list.innerHTML += window.Handlebars.compile(tag)(t);
        });
        this.#tags.map((t) => {
            const label = document.getElementById('tag-' + t);
            if (label) {
                label.addEventListener('click', this.#handleTagDelete);
            }
        });

        input.value = '';
        this.#handleFilter(this.#category, this.#tags);
    }

    #handleTagAddClick = () => {
        const input = <HTMLInputElement>document.getElementById('tags-input');
        if (!input) return;
        this.#tagAdd(input);
    };

    #handleTagAddEnter = (e: KeyboardEvent) => {
        if (e.code !== 'Enter') return;

        this.#tagAdd(<HTMLInputElement>e.target);
    };

    #handleFilter = (category: number | undefined, tags: Array<string>) => {
        if (category === this.#category && tags === this.#tags) {
            Bus.emit(Events.EventsReq, {categories: category, tags: tags});
        }
    };

    #removeListeners() {
        config.categories.map((_, i) => {
            const cat = <HTMLElement>document.getElementById('category-' + i);
            if (!cat) return;
            
            cat.removeEventListener('click', this.#handleCategory);
        });

        const img = <HTMLElement>document.getElementById('categories-img');
        if (img) {
            img.removeEventListener('click', this.#handleCategoryList);
        }

        this.#tags.map((t) => {
            const tag = <HTMLElement>document.getElementById('tag-' + t);
            if (!tag) return;

            tag.removeEventListener('click', this.#handleTagDelete);
        });

        const button = <HTMLElement>document.getElementById('tags-button');
        if (button) {
            button.removeEventListener('click', this.#handleTagAddClick);
        }

        const input = <HTMLInputElement>document.getElementById('tags-input');
        if (input) {
            input.removeEventListener('keydown', this.#handleTagAddEnter);
        }
    }

    render() {
        this.#removeListeners();
        const source = `
            <div class="categories">
                <div class="categories__li">
                    <span class="categories__header">Категории</span>
                    <img id="categories-img" src="/img/categories.png">
                </div>
                <div id="categories-list">
                {{#each this}}
                    <div id="category-{{@index}}" class="categories__li categories__li-type" data-num="{{@index}}">{{name}}</div>
                {{/each}}
                </div>
            </div>
            <div class="tags">
                <div class="tags__li">
                    <span class="categories__header">Теги</span>
                </div>
                <input id="tags-input" class="tags__li" placeholder="Теги шмеги..."></input>
                <button id="tags-button" class="tags__li">Добавить</button>
                <div id="tags-list" class="tags__li"></div>
            </div>
        `;
        const template = window.Handlebars.compile(source)(config.categories);
        this.#parent.innerHTML = template;
        this.#addListeners();
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
