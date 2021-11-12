import { filterToUrl } from '@/modules/filter';
import { ApiUrls, EventData, FetchResponseData, FilterData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { fetchGet } from '@request/request';

export default class MainPageModel {
    enable() {
        Bus.on(Events.EventsReq, this.#eventsHandle);
        Bus.on(Events.FilterChange, this.#filterHandle);
    }

    #filterHandle = (filter: FilterData) => {
        const search = filterToUrl(filter);
        Bus.emit(Events.RouteUpdate, search);
        this.#getEvents(search);
    };

    #eventsHandle = (() => {
        this.#getEvents(); 
    });

    #getEvents(search?: string) {
        if (search === undefined) search = '';
        fetchGet(ApiUrls.Events + search, 
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
    }

    disable() {
        Bus.off(Events.EventsReq, this.#eventsHandle);
    }
}
