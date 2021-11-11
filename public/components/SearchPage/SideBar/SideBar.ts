import config from '@/config';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as tagTemplate from '@templates/tag/tag.hbs';
import * as template from '@search-page/SideBar/sidebar.hbs';
import '@search-page/SideBar/SideBar.css';
import '@templates/tag/tag.css';

const TAG_PING_TIME_MSEC = 500;
const REQ_WAIT_CHANGE_TIME_MSEC = 500;

export default class SideBar {
    #parent: HTMLElement;
    #categoriesOpened: boolean;
    #category?: number;
    #tags: Array<string> = [];

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        this.#categoriesOpened = false;
    }

    #addListeners() {
        const categories = <HTMLElement>document.getElementById('categories-header');
        if (categories) categories.addEventListener('click', this.#handleCategoryList);

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
                const category = <HTMLElement>document.getElementById('category-' + this.#category);
                category.style.backgroundColor = '';
            }
            target.style.backgroundColor = 'var(--category-check)';
            this.#category = index;
        }
        this.#handleFilter();
    };

    #handleCategoryList = (e: MouseEvent) => {
        const target = <HTMLElement>document.getElementById('categories-img');
        const list = <HTMLElement>document.getElementById('categories-list');
        if (!list) return;

        if (this.#categoriesOpened) {
            target.classList.add('categories-img_closed');
            target.classList.remove('categories-img_opened');
            list.className = 'categories-list_closed';
            
        } else {
            target.classList.add('categories-img_opened');
            target.classList.remove('categories-img_closed');
            list.className = 'categories-list_opened';
        }
        this.#categoriesOpened = !this.#categoriesOpened;
    };

    #handleTagDelete = (e: MouseEvent) => {
        const target = <HTMLElement>e.target;
        const tagWrapper = <HTMLElement>e.currentTarget;
        if (!target || !tagWrapper || !target.dataset['tag']) return;
        this.#tags = this.#tags.filter(tag => tag !== target.dataset['tag']);
        tagWrapper.removeEventListener('click', this.#handleTagDelete);
        tagWrapper.outerHTML = '';
        this.#handleFilter();
    };

    #renderTags() {
        const list = <HTMLElement>document.getElementById('tags-list');
        if (!list) return;

        list.innerHTML = '';
        this.#tags.map((t) => {
            list.innerHTML += tagTemplate(t);
        });
        this.#tags.map((t) => {
            const tag = document.getElementById('tag-' + t);
            if (tag) {
                tag.addEventListener('click', this.#handleTagDelete);
            }
        });
    }

    #tagAdd(tag: string) {
        if (this.#tags.indexOf(tag) !== -1) {
            const repeated = <HTMLLabelElement>document.getElementById('tag-label-' + tag);
            if (repeated) {
                repeated.classList.add('tags__tag_error');
                setTimeout(() => repeated.classList.remove('tags__tag_error'), TAG_PING_TIME_MSEC);
            }
            return false;
        }

        const list = <HTMLElement>document.getElementById('tags-list');
        if (!(list)) return false;

        this.#tags.map((t) => {
            const category = <HTMLElement>document.getElementById('tag-' + t);
            if (category) {
                category.removeEventListener('click', this.#handleTagDelete);
            }
        });

        this.#tags.push(tag);
        this.#renderTags();
        return true;
    }

    #handleTagAddClick = () => {
        const input = <HTMLInputElement>document.getElementById('tags-input');
        if (!input) return;
        const added = this.#tagAdd(input.value);
        if (added) {
            input.value = '';
            this.#handleFilter();
        }
    };

    #handleTagAddEnter = (e: KeyboardEvent) => {
        if (e.code !== 'Enter') return;

        const input = <HTMLInputElement>e.target;
        const added = this.#tagAdd(input.value);
        if (added) {
            input.value = '';
            this.#handleFilter();
        }
    };

    #handleFilter() {
        const handle = ((category: number | undefined, tags: Array<string>) => {
            if (category === this.#category && tags === this.#tags) {
                Bus.emit(Events.FilterChange, {category: category, tags: tags});
            }
        }).bind(this);

        setTimeout(handle, REQ_WAIT_CHANGE_TIME_MSEC, this.#category, this.#tags);
    }

    #removeListeners() {
        config.categories.map((_, i) => {
            const category = <HTMLElement>document.getElementById('category-' + i);
            if (!category) return;
            
            category.removeEventListener('click', this.#handleCategory);
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

    renderFilter(category?: number, tags?: Array<string>) {
        if (category) {
            const categoryElemnt = <HTMLElement>document.getElementById('category-' + category);
            categoryElemnt.style.backgroundColor = 'var(--category-check)';
            this.#category = category;
        }

        if (tags && tags.length > 0) {
            this.#tags = [...new Set(tags)];
            this.#renderTags();
        }
    }

    render() {
        this.#removeListeners();
        this.#parent.innerHTML = template(config.categories);
        this.#addListeners();
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
