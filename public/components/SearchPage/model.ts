import { fetchGet } from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { ApiUrls, FetchResponseData, FilterData } from '@/types';
import { filterToUrl } from '@/modules/filter';

export default class SearchPageModel {
    #data: FilterData;

    constructor() {
        this.#data = {
            tags: [],
        };
    }
    
    enable(data: FilterData) {
        this.#data = data;
        // Bus.on(Events.EventsReq, this.#handleEvents);
        // Bus.on(Events.FilterChange, this.#handleFilter);
        // Bus.on(Events.QueryChange, this.#handleQuery);
    }

    #handleFilter = ((data: {category?: number, tags: Array<string>}) => {
        console.log('handleFilter');
        this.#data.category = data.category;
        this.#data.tags = data.tags;
        this.#handleEvents();
    }).bind(this);

    #handleQuery = ((query: string) => {
        console.log('handleQuery');
        this.#data.query = query;
        this.#handleEvents();
    }).bind(this);

    #handleEvents = (() => {
        let filter = '';
        filter = filterToUrl(this.#data);
        console.log('handleEvents');
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
        // Bus.off(Events.EventsReq, this.#handleEvents);
        this.#data = {
            tags: new Array<string>(),
        };
    }
}
