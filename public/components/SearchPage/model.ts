import { fetchGet } from '../../modules/request/request.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import { ApiUrls, FetchResponseData } from '../../types.js';

interface FilterData {
    category?: number,
    tags: Array<string>,
}

export default class SearchPageModel {
    enable() {
        Bus.on(Events.EventsReq, this.#handleEvents);

    }

    #filterToUrl (data: FilterData) {
        let res = '?';
        if (data.category !== undefined) {
            res += 'c=' + data.category;
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
        Bus.emit(Events.RouteUpdate, filter);
        void fetchGet(ApiUrls.Events + filter, 
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
    }
}
