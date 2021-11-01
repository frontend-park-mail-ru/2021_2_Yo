import { fetchGet } from '../../modules/request/request.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import { ApiUrls, FetchResponseData } from '../../types.js';
import config from '../../config.js';

interface FilterData {
    category?: number,
    tags: string[],
    query?: string,
}

export default class SearchPageModel {
    #data: FilterData;

    constructor() {
        this.#data = {
            tags: new Array<string>(),
        };
    }
    
    enable(data: FilterData) {
        this.#data = data;
        Bus.on(Events.EventsReq, this.#handleEvents);
        Bus.on(Events.FilterChange, this.#handleFilter);
        Bus.on(Events.QueryChange, this.#handleQuery);
    }

    #filterToUrl (data: FilterData) {
        let res = '?';

        if (data.query !== undefined && data.query !== '') {
            res += 'query=' + data.query;
        }

        if (data.category !== undefined) {
            if (res.length > 1) res += '&';
            res += 'category=' + config.categories[data.category].name;
        }

        if (data.tags.length > 0) {
            if (res.length > 1) res += '&';
            res += 'tags=';
            res += data.tags.reduce((prev, curr) => {
                return prev + '|' + curr;
            });
        }

        if (res.length === 1) {
            res = '';
        }
        return res;
    }

    #handleFilter = ((data: {category?: number, tags: Array<string>}) => {
        this.#data.category = data.category;
        this.#data.tags = data.tags;
        this.#handleEvents();
    }).bind(this);

    #handleQuery = ((query: string) => {
        this.#data.query = query;
        this.#handleEvents();
    }).bind(this);

    #handleEvents = (() => {
        let filter = '';
        filter = this.#filterToUrl(this.#data);
        Bus.emit(Events.RouteUpdate, filter);
        fetchGet(ApiUrls.Events + filter, 
            (data: FetchResponseData) => {
                if (data.status === 200) {
                    if (data.json.status === 200) {
                        Bus.emit(Events.EventsRes, data.json.body?.events);
                        return;
                    }
                }
                Bus.emit(Events.EventsError);
            }, () => {
                Bus.emit(Events.EventsError);
            });
    }).bind(this);

    disable() {
        Bus.off(Events.EventsReq, this.#handleEvents);
        this.#data = {
            tags: new Array<string>(),
        };
    }
}
