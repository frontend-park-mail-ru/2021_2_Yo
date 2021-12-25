import { ApiStatus, ApiUrls, EventData, FetchResponseData, UserData } from '@/types';
import { fetchDelete, fetchGet, fetchPost, fetchPostMultipart } from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import UserStore from '@modules/userstore';

type MultipartData = {
    input: Map<string, { errors: string[], value: string }>,
    file?: File,
};

export default class ProfilePageModel {
    getUser(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId, (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const user = <UserData>json.body;
                    Bus.emit(Events.UserByIdRes, user);
                    return;
                }
            }
        });

    }

    editUser(mdata: MultipartData) {
        const newUserInfo = {
            name: <string>mdata['input'].get('name')?.value,
            surname: <string>mdata['input'].get('surname')?.value,
            description: <string>mdata['input'].get('selfDescription')?.value,
        };

        const stored = <UserData>UserStore.get();

        if (!mdata.file &&
            stored.name === newUserInfo.name &&
            stored.surname === newUserInfo.surname &&
            stored.description === newUserInfo.description) {
            Bus.emit(Events.UserRes, stored);
        } else {
            stored.name = newUserInfo.name;
            stored.surname = newUserInfo.surname;
            stored.description = newUserInfo.description;

            fetchPostMultipart(ApiUrls.User + '/info', {
                json: stored,
                file: mdata['file']
            }, (data: FetchResponseData) => {
                const { status, json } = data;
                if (status === ApiStatus.Ok) {
                    if (json.status === ApiStatus.Ok) {
                        UserStore.reset();
                        if (!mdata['file']) {
                            Bus.emit(Events.UserRes, stored);
                        } else {
                            Bus.emit(Events.UserReq);
                        }
                    }
                }
            });
        }
    }

    editPassword(password: string) {
        fetchPost(ApiUrls.User + '/password', { password }, (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const stored = <UserData>UserStore.get();
                    Bus.emit(Events.UserRes, stored);
                    return;
                }
            }
        });
    }

    getUserEventsCreated(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + ApiUrls.Events + '/created', (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const events = <EventData[]>json.body.events;
                    Bus.emit(Events.EventsRes, events);
                    return;
                }
            }
        });
    }

    getUserEventsFavourite(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + ApiUrls.Events + '/favourite', (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const events = <EventData[]>json.body.events;
                    Bus.emit(Events.EventsResFav, events);
                    return;
                }
            }
        });
    }

    getSubscribers(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + '/subscribers', (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const users = <UserData[]>json.body.users;
                    Bus.emit(Events.SubscribersRes, users);
                    return;
                }
            }
        });
    }

    getSubscriptions(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + '/subscriptions', (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const users = <UserData[]>json.body.users;
                    Bus.emit(Events.SubscriptionsRes, users);
                    return;
                }
            }
        });
    }

    getIsSubscribed(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + '/subscription', (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const result = json.body.result;
                    Bus.emit(Events.UserIsSubscribedRes, result);
                    return;
                }
                if (json.status === ApiStatus.NotAuthorized) {
                    Bus.emit(Events.UserIsSubscribedRes);
                    return;
                }
            }
        });
    }

    makeSubscription(userId: string) {
        fetchPost(ApiUrls.User + '/' + userId + '/subscription', {}, (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    Bus.emit(Events.SubscribeRes, userId);
                    return;
                }
            }
        });
    }

    unsubscribe(userId: string) {
        fetchDelete(ApiUrls.User + '/' + userId + '/subscription', (data: FetchResponseData) => {
            const { status, json } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    Bus.emit(Events.UnsubscribeRes, userId);
                    return;
                }
            }
        });
    }
}
