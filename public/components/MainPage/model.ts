import { ApiUrls, EventData, FetchResponseData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { fetchGet } from '@request/request';

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
                        const events = <EventData[]>json.body.events;
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
