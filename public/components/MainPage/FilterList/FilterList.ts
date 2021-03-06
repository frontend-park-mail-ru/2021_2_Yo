import * as template from '@main-page/FilterList/filterlist.hbs';
import * as tagTemplate from '@templates/tag/tag.hbs';
import '@templates/tag/tag.scss';
import '@main-page/FilterList/FilterList.scss';
import { FilterData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import CityStore from '@/modules/citystore';
import FilterStore, { FilterParams } from '@/modules/filter';
import Calendar from '@calendar/calendar';
import SuggestList from '@/components/SuggestList/SuggestList';

const TAG_PING_TIME_MSEC = 500;

export default class FilterListComponent {
    #parent: HTMLElement;
    #search?: HTMLInputElement;
    #categories?: HTMLElement[];
    #tags?: HTMLElement;
    #tagInput?: HTMLInputElement;
    #dateInput?: HTMLInputElement;
    #cityInput?: HTMLInputElement;
    #citySuggestList?: SuggestList;
    #tagPlus?: HTMLElement;
    #dateCross?: HTMLElement;
    #cityCross?: HTMLElement;
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
            const repeated = <HTMLElement>document.getElementById('tag-' + tag);
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

        const tags = Array.from(this.#filter['tags']);
        tags.push(tag);
        this.#filter = FilterStore.set(FilterParams.Tags, tags);
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
        this.#search?.addEventListener('input', this.#handleSearch);
        this.#categories?.map((category) => {
            category.addEventListener('click', this.#handleCategoryClick);
        });
        this.#tagInput?.addEventListener('keydown', this.#handleTagAdd);
        this.#tagPlus?.addEventListener('click', this.#handleTagAdd);
        this.#dateInput?.addEventListener('change', this.#handleDateChange);
        this.#dateInput?.addEventListener('input', this.#handleDateInput);
        this.#dateCross?.addEventListener('click', this.#handleDateDelete);
        this.#dateInput?.addEventListener('click', this.#handleCalendarRender);
        this.#cityInput?.addEventListener('suggest', <EventListener>this.#handleCityInput);
        this.#cityCross?.addEventListener('click', this.#handleCityDelete);
    }

    #handleCityDelete = () => {
        if (this.#cityInput) {
            this.#cityInput.value = '';
            this.#cityInput.focus();
        }
    };
    
    #handleDateDelete = () => {
        if (this.#dateInput) {
            this.#dateInput.value = '';
            this.#dateInput.dispatchEvent(new Event('change'));
        }
    };

    #handleSearch = () => {
        const value = this.#search?.value.trim();
        this.#filter = FilterStore.set(FilterParams.Query, value, false);
    };

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
        const tag = <HTMLElement>document.getElementById('tag-' + target.dataset['tag']);
        tag.outerHTML = '';
        this.#tags = <HTMLElement>document.getElementById('filter-tags');
        this.#filter = FilterStore.set(FilterParams.Tags, tags);
    };

    #handleDateInput = () => {
        if (this.#dateInput?.value.trim() === '') {
            this.#filter = FilterStore.set(FilterParams.Date, undefined);
            return;
        }
    };

    #handleDateChange = () => {
        this.#dateInput?.classList.remove('form-input_changed');
        const date = <string>this.#dateInput?.value.trim();
        this.#filter = FilterStore.set(FilterParams.Date, date);
    };

    #handleCityInput = (e: CustomEvent) => {
        this.#filter = FilterStore.set(FilterParams.City, e.detail);
    };

    #handleCalendarRender = () => {
        const calendarBlock = <HTMLInputElement>document.getElementById('calendarBlock');

        if (!calendarBlock.innerHTML) {
            const calendar = new Calendar(calendarBlock);
            calendar.render();
        }
    };

    #removeListeners() {
        this.#search?.removeEventListener('input', this.#handleSearch);
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
        this.#dateInput?.removeEventListener('input', this.#handleDateInput);
        this.#dateInput?.removeEventListener('click', this.#handleCalendarRender);
        this.#cityInput?.removeEventListener('suggest', <EventListener>this.#handleCityInput);
        this.#cityCross?.removeEventListener('click', this.#handleCityDelete);
    }

    #renderFilter() {
        this.#filter = FilterStore.get();
        if (this.#filter['query'] !== undefined) {
            if (this.#search) {
                this.#search.value = this.#filter['query'];
            }
        }

        if (this.#filter['category'] !== undefined) {
            if (this.#categories) {
                this.#categories[this.#filter['category']].style.backgroundColor = 'var(--category-selected)';
            }
        }

        if (this.#filter['tags'] !== undefined && this.#filter['tags'].length > 0) {
            this.#renderTags();
        }

        if (this.#filter['date'] !== undefined && this.#filter['date'] !== '') {
            if (this.#dateInput) this.#dateInput.value = this.#filter['date'];
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
        this.#search = <HTMLInputElement>document.getElementById('filter-search-input');
        this.#categories = config.categories.map((_, index) => {
            return <HTMLElement>document.getElementById('filter-category-' + index.toString());
        });
        this.#tags = <HTMLElement>document.getElementById('filter-tags');
        this.#tagInput = <HTMLInputElement>document.getElementById('filter-tag-input');
        this.#tagPlus = <HTMLElement>document.getElementById('tags-search-img');
        this.#dateInput = <HTMLInputElement>document.getElementById('dateInput');
        this.#dateCross = <HTMLElement>document.getElementById('date-delete-img');
        this.#cityInput = <HTMLInputElement>document.getElementById('filter-city-input');
        this.#cityCross = <HTMLElement>document.getElementById('city-delete-img');
        const citySuggestList = <HTMLElement>document.getElementById('city-suggest-list');
        this.#citySuggestList = new SuggestList('city', citySuggestList, this.#cityInput, CityStore.get());
        this.#addListeners();
        this.#renderFilter();
    }

    disable() {
        this.#citySuggestList?.disable();
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
