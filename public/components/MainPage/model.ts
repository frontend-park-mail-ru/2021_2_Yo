import { ApiUrls, EventCardData, FetchResponseData } from '../../types';
import Bus from '../../modules/eventbus/eventbus';
import Events from '../../modules/eventbus/events';
import { fetchGet } from '../../modules/request/request';

export default class MainPageModel {
    enable() {
        Bus.on(Events.EventsReq, this.#eventsHandle);
    }

    #eventsHandle = (() => {
        void fetchGet(ApiUrls.Events, 
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
