import * as template from '@main-page/FilterList/filterlist.hbs';
import * as tagTemplate from '@main-page/FilterList/tag.hbs';
import '@main-page/FilterList/FilterList.css';
import { FilterData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import CityStore from '@/modules/citystore';

const TAG_PING_TIME_MSEC = 500;
const REQ_WAIT_CHANGE_TIME_MSEC = 500;


export default class FilterListComponent {
    #parent: HTMLElement;
    #categories?: HTMLElement[];
    #tags?: HTMLElement;
    #tagInput?: HTMLInputElement;
    #dateInput?: HTMLInputElement;
    #cityInput?: HTMLInputElement;
    #tagPlus?: HTMLElement;
    #filter: FilterData;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        this.#filter = {
            tags: [],
        };
        const callback = () => {Bus.off(Events.CitiesRes, callback); this.render();};
        Bus.on(Events.CitiesRes, callback);
    }

    #handleFilter() {
        const handle = (filter: FilterData) => {
            if (this.#filter === filter) {
                Bus.emit(Events.EventsReq, filter);
            }
        };
        setTimeout(handle, REQ_WAIT_CHANGE_TIME_MSEC, this.#filter);
    }

    #tagAdd(tag: string): boolean {
        tag = tag.trim();
        if (!tag) return false;
        if (this.#filter['tags']?.indexOf(tag) !== -1) {
            const repeated = <HTMLElement>document.getElementById('filter-tag-' + tag);
            if (repeated) {
                repeated.classList.add('tag_error');
                setTimeout(() => repeated.classList.remove('tag_error'), TAG_PING_TIME_MSEC);
            }
            return false;
        }

        this.#filter?.['tags'].map((name) => {
            const tagCross = <HTMLElement>document.getElementById('tag-cross-' + name);
            tagCross.removeEventListener('click', this.#handleTagDelete);
        });

        this.#filter['tags'].push(tag);
        this.#renderTags();
        return true;
    }

    #renderTags() {
        if (!this.#tags) return;
        this.#tags.innerHTML = '';
        this.#filter['tags']?.map((tag) => {
            if (this.#tags) this.#tags.innerHTML += tagTemplate(tag);
        });
        this.#filter['tags']?.map((t) => {
            const tagCross = document.getElementById('tag-cross-' + t);
            if (tagCross) {
                tagCross.addEventListener('click', this.#handleTagDelete);
            }
        });
    }

    #addListeners() {
        this.#categories?.map((category) => {
            category.addEventListener('click', this.#handleCategoryClick);
        });
        this.#tagInput?.addEventListener('keydown', this.#handleTagAdd);
        this.#tagPlus?.addEventListener('click', this.#handleTagAdd);
        this.#dateInput?.addEventListener('change', this.#handleDateChange);
        this.#cityInput?.addEventListener('input', this.#handleCityInput);
    }


    #handleCategoryClick = (e: MouseEvent) => {
        const target = <HTMLElement>e.target; 
        const index = +<string>target.dataset['num'];
        const selected = this.#filter['category'];
        if (selected === index) {
            target.style.backgroundColor = '';
            this.#filter['category'] = undefined;
        } else {
            if (selected !== undefined && this.#categories) {
                this.#categories[selected].style.backgroundColor = '';
            }
            target.style.backgroundColor = 'var(--category-selected)';
            this.#filter['category'] = index;
        }
        this.#handleFilter();
    };

    #handleTagAdd = (e: KeyboardEvent | MouseEvent) =>  {
        if (e instanceof KeyboardEvent) {
            if (e.code !== 'Enter') return;
        }

        const input = <HTMLInputElement>this.#tagInput;
        const added = this.#tagAdd(input.value);
        if (added) {
            input.value = '';
            this.#handleFilter();
        }
    };

    #handleTagDelete = (e: MouseEvent) => {
        const target = <HTMLElement>e.currentTarget;
        if (!target || !target.dataset['tag']) return;
        this.#filter['tags'] = this.#filter['tags']?.filter(tag => tag !== target.dataset['tag']);
        const tags = this.#filter['tags'];
        target.removeEventListener('click', this.#handleTagDelete);
        const tag = <HTMLElement>document.getElementById('filter-tag-' + target.dataset['tag']);
        tag.outerHTML = '';
        this.#tags = <HTMLElement>document.getElementById('filter-tags');
        this.#handleFilter();
    };

    #handleDateChange = () => {
        const value = <string>this.#dateInput?.value;
        const date = value.split('-').reduce((prev, curr) => {return curr + '.' + prev;}, '');
        this.#filter['date'] = date.slice(0, date.length - 1);
        this.#handleFilter();
    };

    #handleCityInput = () => {
        const value = <string>this.#cityInput?.value;
        this.#filter['city'] = value;
        this.#handleFilter();
    };

    #removeListeners() {
        this.#categories?.map((category) => {
            category.removeEventListener('click', this.#handleCategoryClick);
        });
        this.#tagInput?.removeEventListener('keydown', this.#handleTagAdd);

        if (this.#filter.tags) {
            this.#filter['tags'].map((name) => {
                const tagCross = <HTMLElement>document.getElementById('tag-cross-' + name);
                tagCross.removeEventListener('click', this.#handleTagDelete);
            });
        }
        this.#tagPlus?.removeEventListener('click', this.#handleTagAdd);
        this.#dateInput?.removeEventListener('change', this.#handleDateChange);
        this.#cityInput?.removeEventListener('input', this.#handleCityInput);
    }

    renderFilter(filter: FilterData) {
        this.#filter['category'] = filter['category'];
        this.#filter['query'] = filter['query'];
        this.#filter['tags'] = filter['tags'];
        this.#filter['date'] = filter['date'];
        this.#filter['city'] = filter['city'];
        if (this.#filter['category'] !== undefined) {
            if (this.#categories) {
                this.#categories[this.#filter['category']].style.backgroundColor = 'var(--category-selected)';
            }
        }

        if (this.#filter['tags'] !== undefined && this.#filter['tags'].length > 0) {
            this.#renderTags(); 
        }

        if (this.#filter['date'] !== undefined && this.#filter['date'] !== '') {
            const date = filter['date']?.split('.').reduce((prev, curr) => {return curr + '-' + prev;}, '');
            this.#filter['date'] = date?.slice(0, date.length - 1);
            if (this.#dateInput) {
                this.#dateInput.value = <string>this.#filter['date'];
            }
        }

        if(this.#filter['city'] !== undefined && this.#filter['city'] !== '') {
            if (this.#cityInput) {
                this.#cityInput.value = this.#filter['city'];
            }
        }
    }

    render() {
        this.#parent.innerHTML = template({
            categories: config.categories,
            cities: CityStore.get()
        });
        this.#categories = config.categories.map((_, index) => {
            return <HTMLElement>document.getElementById('filter-category-' + index.toString());
        });
        this.#tags = <HTMLElement>document.getElementById('filter-tags');
        this.#tagInput = <HTMLInputElement>document.getElementById('filter-tag-input');
        this.#tagPlus = <HTMLElement>document.getElementById('tags-search-img');
        this.#dateInput = <HTMLInputElement>document.getElementById('filter-date-input');
        this.#cityInput = <HTMLInputElement>document.getElementById('filter-city-input');
        this.#addListeners();
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
