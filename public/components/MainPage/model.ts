import { ApiUrls, UrlPathnames } from '../../types.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import { fetchGet } from '../../modules/request/request.js';

export default class MainPageModel {
    constructor() {
        Bus.on(Events.EventsReq, this.#eventsHandle);
        Bus.on(Events.UserReq, this.#userHandle);
    }

    #userHandle = (() => {
        void fetchGet(ApiUrls.User, Events.EventsRes);
    });

    #eventsHandle = (() => {
        void fetchGet(ApiUrls.Events, Events.EventsRes);
    });
}
