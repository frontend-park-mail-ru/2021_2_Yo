import { fetchGet } from '../../modules/request/request.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import { ApiUrls, FetchResponseData } from '../../types.js';

export default class SearchPageModel {
    constructor() {
        Bus.on(Events.EventsReq, this.#handleEvents);
    }

    #handleEvents = (() => {
        void fetchGet(ApiUrls.Events, 
            (data: FetchResponseData) => {
                if (data.status === 200) {
                    if (data.json.status === 200) {
                        Bus.emit(Events.EventsRes, data.json.body);
                    }
                }
            });
    }).bind(this);

    disable() {
        Bus.off(Events.EventsReq, this.#handleEvents);
    }
}
