import { fetchGet } from '../../modules/request/request.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import { ApiUrls, FetchResponseData } from '../../types.js';

interface FilterData {
    categories: Array<boolean>,
    tags: Array<string>,
}

export default class SearchPageModel {
    constructor() {
        Bus.on(Events.EventsReq, this.#handleEvents);
    }

    #filterToUrl (data: FilterData) {
        let res = '?c=';
        data.categories.map((c, i) => {
            if (c) {
                res += i.toString() + '|';
            }
        });
        if (res.length > 3) {
            res = res.slice(0, -1);
        } else {
            res = '?';
        }
        if (data.tags.length > 0) {
            res += '&t=';
            res += data.tags.reduce((prev, curr) => {
                return prev + '|' + curr;
            });
        }
        if (res.length === 1) {
            res = '';
        }
        return res;
    }

    #handleEvents = ((data?: FilterData) => {
        let filter = '';
        if (data) {
            filter = this.#filterToUrl(data);
        }
        void fetchGet(ApiUrls.Events, 
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
            }, filter);
    }).bind(this);

    disable() {
        Bus.off(Events.EventsReq, this.#handleEvents);
    }
}
