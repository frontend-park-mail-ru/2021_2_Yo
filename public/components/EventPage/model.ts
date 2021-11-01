import {fetchDelete, fetchGet} from '../../modules/request/request.js';
import {ApiUrls, EventData, FetchResponseData, UrlPathnames} from '../../types.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';

export default class EventPageModel {
    getEvent(id: string) {
        void fetchGet(ApiUrls.Events + '/' + id,
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        const event = json.body as EventData;
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
                        Bus.emit(Events.RouteBack);
                    }
                }
            }
        );
    }
}
