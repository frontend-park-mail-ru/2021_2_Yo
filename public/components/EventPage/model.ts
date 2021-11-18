import {fetchDelete, fetchGet} from '@request/request';
import {ApiUrls, EventData, FetchResponseData, UrlPathnames} from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import userstore from '@modules/userstore';

export default class EventPageModel {
    getEvent(id: string) {
        fetchGet(ApiUrls.Events + '/' + id,
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
        fetchDelete(ApiUrls.Events + '/' + id,
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        console.log(UrlPathnames.Profile + '?id=' + userstore.get()?.id);
                        Bus.emit(Events.RouteUrl, UrlPathnames.Profile + '?id=' + userstore.get()?.id);
                    }
                }
            }
        );
    }
}
