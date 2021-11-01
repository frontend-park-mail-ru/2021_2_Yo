import { ApiUrls, EventCardData, FetchResponseData } from '../../types.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import { fetchGet } from '../../modules/request/request.js';

export default class MainPageModel {
    enable() {
        Bus.on(Events.EventsReq, this.#eventsHandle);
    }

    #eventsHandle = (() => {
        fetchGet(ApiUrls.Events, 
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status) {
                        const events = <EventCardData[]>json.body.events;
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
    });

    disable() {
        Bus.off(Events.EventsReq, this.#eventsHandle);
    }
}
