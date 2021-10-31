import { ApiUrls, EventData, FetchResponseData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { fetchGet } from '@request/request';

// const event: EventData = {
//     id: 1,
//     city: '',
//     category: 'ls',
//     viewed: 88,
//     title: 'tusa',
//     description: 'jusa',
//     tag: ['lala', 'la'],
//     text: 'text',
//     date: 'date',
//     geo: 'mocow',
// };
// const events: EventData[] = [event, event, event];

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
                        const events = <EventData[]>json.body.events;
                        Bus.emit(Events.EventsRes, events); 
                        return;
                    }
                }
                // Bus.emit(Events.EventsRes, events); 
                Bus.emit(Events.EventsError);
            },
            () => {
                // Bus.emit(Events.EventsRes, events); 
                Bus.emit(Events.EventsError);
            }
        );
    });

    disable() {
        Bus.off(Events.EventsReq, this.#eventsHandle);
    }
}
