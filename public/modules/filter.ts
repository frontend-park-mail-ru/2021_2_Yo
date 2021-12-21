import { ApiStatus, ApiUrls, EventData, FetchResponseData, FilterData, UrlPathnames } from '@/types';
import config from '@/config';
import { fetchGet } from './request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import UserStore from './userstore';

const REQ_WAIT_CHANGE_TIME_MSEC = 500;

function customIndexOfCategories(category: string) {
    for (let i = 0; i < config.categories.length; i++) {
        if (config.categories[i].name === category) {
            return i;
        }
    }
    return -1;
}

export function filterToUrl () {
    const data = fStore.get();
    let res = '?';

    if (data.query && data.query !== '') {
        res += 'query=' + data.query;
    }

    if (data.category !== undefined && data.category < config.categories.length) {
        if (res.length > 1) res += '&';
        res += 'category=' + config.categories[data.category].name;
    }

    if (data.tags && data.tags.length > 0) {
        if (res.length > 1) res += '&';
        res += 'tags=';
        res += data.tags.reduce((prev, curr) => {
            return prev + '|' + curr;
        });
    }

    if (data.date && data.date !== '') {
        if (res.length > 1) res += '&';
        res += 'date=' + data.date;
    }

    if (data.city && data.city !== '') {
        if (res.length > 1) res += '&';
        res += 'city=' + data.city;
    }

    if (res.length === 1) {
        res = '';
    }
    return encodeURI(res);
}

export function parseParams(): FilterData {
    const queryParam = new URL(window.location.href).searchParams?.get('query')?.trim();
    let query: undefined | string;
    if (queryParam) {
        query = queryParam;
    }
    const categoryParam = new URL(window.location.href).searchParams?.get('category');
    let category: undefined | number;
    if (categoryParam) {
        category = customIndexOfCategories(categoryParam);
        if (category === -1) {
            category = undefined;
        }
    }

    const tagsParam = new URL(window.location.href).searchParams?.get('tags');
    let tags = new Array<string>();
    if (tagsParam) {
        tags = tagsParam.split('|');
        tags = tags.map(tag => tag.trim());
        tags = tags.filter(tag => tag !== '');
    }

    const dateParam = new URL(window.location.href).searchParams?.get('date');
    let date: undefined | string;
    if (dateParam) date = dateParam;

    const cityParam = new URL(window.location.href).searchParams?.get('city');
    let city: undefined | string;
    if (cityParam) city = cityParam;

    return { query, category, tags, date, city };
}

function userSearch(): string {
    const user = UserStore.get();
    if (!user) return '';
    return 'userId=' + user.id;
}

export enum FilterParams {
    Query = 'query',
    Tags = 'tags', 
    Category = 'category', 
    Date = 'date', 
    City = 'city', 
}

class FilterStore {
    #filter: FilterData;
    #enabled: boolean;
    #events?: EventData[];

    constructor() {
        this.#filter = parseParams();
        this.#enabled = false;
        Bus.on(Events.RouteChange, this.#handleRouteChange);
    }

    enable() {
        Bus.on(Events.EventsReq, this.#handleFilterChange);
        Bus.on(Events.EventsStoredReq, this.#handleStoredEvents);
        this.#enabled = true;
    }

    disable() {
        Bus.off(Events.EventsReq, this.#handleFilterChange);
        Bus.off(Events.EventsStoredReq, this.#handleStoredEvents);
        this.#enabled = false;
    }

    get() {
        const filter: FilterData = {
            query: this.#filter['query'],
            tags: this.#filter['tags'],
            category: this.#filter['category'],
            date: this.#filter['date'],
            city: this.#filter['city'],
        }; 
        return filter;
    }

    #isEqual(filter: FilterData): boolean {
        for (const [key, value] of Object.entries(this.#filter)) {
            if (value !== filter[<FilterParams>key]) {
                return false;
            }
        }
        return true;
    }

    set(param: FilterParams, value?: string | string[] | number, header?: boolean): FilterData {
        let filter = fStore.get();
        if (filter[param] === <undefined>value) return fStore.get();
        this.#filter[param] = <undefined>value;
        const handle = (filter: FilterData) => {
            if (this.#isEqual(filter)) {
                this.#handleFilterChange(header);
            }
        };
        filter = fStore.get();
        setTimeout(handle, REQ_WAIT_CHANGE_TIME_MSEC, filter);
        return filter;
    }

    reset() {
        this.#filter = { 
            query: undefined,
            tags: [],
            category: undefined,
            date: undefined,
            city: undefined,
        };
    }

    #onlyQuery(): boolean {
        if (this.#filter['query']) {
            if ((!this.#filter['category']) &&
                (!this.#filter['tags'] || this.#filter['tags'].length == 0) &&
                (!this.#filter['date'] || this.#filter['date'] == '') &&
                (!this.#filter['city'] || this.#filter['city'] == '')
            ) {
                return true;
            }
        }
        return false;
    }

    #handleRouteChange = (path: string) => {
        // return;
        console.log('route change?');
        console.log('PATH: <' + path + '>');
        if (path == UrlPathnames.Main) {
            if (!this.#enabled) {
                this.enable();
            }
            this.#filter = parseParams();
            console.log(this.#filter);
        } else {
            if (this.#enabled) {
                this.disable();
            }
            this.reset();
        }
    };

    #handleFilterChange = (header?: boolean) => {
        console.log('filter change!!!');
        console.log(this.#filter);
        let search = filterToUrl();
        if (this.#onlyQuery() && header !== false) {
            Bus.emit(Events.RouteUrl, UrlPathnames.Main + search);
        } else {
            Bus.emit(Events.RouteUpdate, search);
        }

        const user = userSearch();
        if (user !== '') {
            if (search === '') {
                search = '?' + user;
            } else {
                search = search + '&' + user;
            }
        }

        console.log('SEARCH: <' + search + '>');
        fetchGet(ApiUrls.Events + search, 
            (data: FetchResponseData) => {
                const { status, json } = data;
                if (status === ApiStatus.Ok) {
                    if (json.status) {
                        const events = <EventData[]>json.body.events;
                        this.#events = events;
                        Bus.emit(Events.EventsRes, events); 
                        return;
                    }
                }
                Bus.emit(Events.EventsError);
            },
            () => {
                Bus.emit(Events.EventsError);
            }
        );

    };

    #handleStoredEvents = () => {
        Bus.emit(Events.EventsStoredRes, this.#events);
    };
}


const fStore = new FilterStore();
export default fStore;
