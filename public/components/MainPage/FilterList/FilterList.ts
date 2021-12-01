import * as template from '@main-page/FilterList/filterlist.hbs';
import * as tagTemplate from '@main-page/FilterList/tag.hbs';
import '@main-page/FilterList/FilterList.css';
import {FilterData} from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import CityStore from '@/modules/citystore';
import FilterStore, {FilterParams} from '@/modules/filter';
import Calendar from '@calendar/calendar';

const TAG_PING_TIME_MSEC = 500;


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
        this.#filter = FilterStore.get();
        const callback = () => {
            Bus.off(Events.CitiesRes, callback);
            this.render();
        };
        Bus.on(Events.CitiesRes, callback);
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

        this.#filter['tags']?.map((name) => {
            const tagCross = <HTMLElement>document.getElementById('tag-cross-' + name);
            tagCross.removeEventListener('click', this.#handleTagDelete);
        });

        this.#filter['tags'].push(tag);
        FilterStore.set(FilterParams.Tags, this.#filter['tags']);
        this.#renderTags();
        return true;
    }

    #renderTags() {
        if (!this.#tags) return;
        this.#tags.innerHTML = '';
        if (this.#filter['tags']) {
            (this.#filter['tags']).map((tag) => {
                if (this.#tags) this.#tags.innerHTML += tagTemplate(tag);
            });
        }
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
        this.#dateInput?.addEventListener('input', this.#handleDateChange);
        this.#dateInput?.addEventListener('click', this.#handleCalendarRender);
        this.#cityInput?.addEventListener('input', this.#handleCityInput);
    }


    #handleCategoryClick = (e: MouseEvent) => {
        const target = <HTMLElement>e.target;
        const index = +<string>target.dataset['num'];
        const selected = this.#filter['category'];
        let category: number | undefined;
        if (selected === index) {
            target.style.backgroundColor = '';
        } else {
            if (selected !== undefined && this.#categories) {
                this.#categories[selected].style.backgroundColor = '';
            }
            target.style.backgroundColor = 'var(--category-selected)';
            category = index;
        }
        this.#filter = FilterStore.set(FilterParams.Category, category);
    };

    #handleTagAdd = (e: KeyboardEvent | MouseEvent) => {
        if (e instanceof KeyboardEvent) {
            if (e.code !== 'Enter') return;
        }

        const input = <HTMLInputElement>this.#tagInput;
        const added = this.#tagAdd(input.value);
        if (added) input.value = '';
    };

    #handleTagDelete = (e: MouseEvent) => {
        const target = <HTMLElement>e.currentTarget;
        if (!target || !target.dataset['tag']) return;
        const tags = this.#filter['tags']?.filter(tag => tag !== target.dataset['tag']);
        target.removeEventListener('click', this.#handleTagDelete);
        const tag = <HTMLElement>document.getElementById('filter-tag-' + target.dataset['tag']);
        tag.outerHTML = '';
        this.#tags = <HTMLElement>document.getElementById('filter-tags');
        this.#filter = FilterStore.set(FilterParams.Tags, tags);
    };

    #handleDateChange = () => {
        const date = <string>this.#dateInput?.value;
        // let date = value.split('-').reduce((prev, curr) => {return curr + '.' + prev;}, '');
        // date = date.slice(0, date.length - 1);
        this.#filter = FilterStore.set(FilterParams.Date, date);
    };

    #handleCityInput = () => {
        const value = <string>this.#cityInput?.value;
        this.#filter = FilterStore.set(FilterParams.City, value);
    };

    #handleCalendarRender = () => {
        const calendarBlock = <HTMLInputElement>document.getElementById('calendarBlock');

        if (!calendarBlock.innerHTML) {
            const calendar = new Calendar(calendarBlock);
            calendar.render();
        }
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
        this.#dateInput?.removeEventListener('input', this.#handleDateChange);
        this.#dateInput?.removeEventListener('click', this.#handleCalendarRender);
        this.#cityInput?.removeEventListener('input', this.#handleCityInput);
    }

    #renderFilter() {
        this.#filter = FilterStore.get();
        if (this.#filter['category'] !== undefined) {
            if (this.#categories) {
                this.#categories[this.#filter['category']].style.backgroundColor = 'var(--category-selected)';
            }
        }

        if (this.#filter['tags'] !== undefined && this.#filter['tags'].length > 0) {
            this.#renderTags();
        }

        if (this.#filter['date'] !== undefined && this.#filter['date'] !== '') {
            const date = this.#filter['date']?.split('.').reduce((prev, curr) => {
                return curr + '-' + prev;
            }, '');
            this.#filter['date'] = date?.slice(0, date.length - 1);
            if (this.#dateInput) {
                this.#dateInput.value = this.#filter['date'];
            }
        }

        if (this.#filter['city'] !== undefined && this.#filter['city'] !== '') {
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
        this.#dateInput = <HTMLInputElement>document.getElementById('dateInput');
        this.#cityInput = <HTMLInputElement>document.getElementById('filter-city-input');
        this.#addListeners();
        this.#renderFilter();
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
