import {fetchDelete, fetchGet} from '@request/request';
import {ApiUrls, EventData, FetchResponseData, UrlPathnames} from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

export default class EventPageModel {
    getEvent(id: string) {
        void fetchGet(ApiUrls.Events + '/' + id,
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        const event = <EventData>json.body;
                        Bus.emit(Events.EventRes, event);
                    }
                }
            }
        );
    }

    deleteEvent(id: string) {
        void fetchDelete(ApiUrls.Events + '/' + id,
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        Bus.emit(Events.RouteUrl, UrlPathnames.Main);
                    }
                }
            }
        );
    }
}
