import {fetchDelete, fetchGet, fetchPost} from '@request/request';
import {ApiUrls, EventData, FetchResponseData, UrlPathnames, UserData} from '@/types';
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
                        Bus.emit(Events.RouteUrl, UrlPathnames.Profile + '?id=' + userstore.get()?.id);
                    }
                }
            }
        );
    }

    addEventToFavourite(id: string) {
        fetchPost(ApiUrls.Events + '/' + id + '/favourite', {},
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        Bus.emit(Events.EventAddFavRes, id);
                    }
                }
            }
        );
    }

    removeEventFromFavourite(id: string) {
        fetchDelete(ApiUrls.Events + '/' + id + '/favourite',
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        Bus.emit(Events.EventRemoveFavRes, id);
                    }
                }
            }
        );
    }

    isEventFavourite(id: string) {
        fetchGet(ApiUrls.Events + '/' + id + '/favourite',
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        const result = json.body.result;
                        Bus.emit(Events.EventFavRes, result);
                    }
                }
            }
        );
    }

    getAuthor(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const user = <UserData>json.body;
                    Bus.emit(Events.EventAuthorRes, user);
                    return;
                }
            }
        });
    }
}
