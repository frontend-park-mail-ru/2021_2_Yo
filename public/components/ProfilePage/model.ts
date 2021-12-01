import {ApiUrls, EventData, FetchResponseData, UserData} from '@/types';
import {fetchDelete, fetchGet, fetchPost, fetchPostMultipart} from '@request/request';
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
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const user = json.body as UserData;
                    Bus.emit(Events.UserByIdRes, user);
                    return;
                }
            }
        });

    }

    editUser(data: MultipartData) {
        const newUserInfo = {
            name: data['input'].get('name')?.value as string,
            surname: data['input'].get('surname')?.value as string,
            description: data['input'].get('selfDescription')?.value as string,
        };

        const stored = UserStore.get() as UserData;

        if (!data.file &&
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
                file: data['file']
            }, (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        UserStore.reset();
                        Bus.emit(Events.UserReq);
                        return;
                    }
                }
            });
        }
    }

    editPassword(password: string) {
        fetchPost(ApiUrls.User + '/password', {password}, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const stored = UserStore.get() as UserData;
                    Bus.emit(Events.UserRes, stored);
                    return;
                }
            }
        });
    }

    getUserEventsCreated(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + ApiUrls.Events + '/created', (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const events = json.body.events as EventData[];
                    Bus.emit(Events.EventsRes, events);
                    return;
                }
            }
        });
    }

    getUserEventsFavourite(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + ApiUrls.Events + '/favourite', (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const events = json.body.events as EventData[];
                    Bus.emit(Events.EventsResFav, events);
                    return;
                }
            }
        });
    }

    getSubscribers(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + '/subscribers', (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const users = json.body.users as UserData[];
                    Bus.emit(Events.SubscribersRes, users);
                    return;
                }
            }
        });
    }

    getSubscriptions(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + '/subscriptions', (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const users = json.body.users as UserData[];
                    Bus.emit(Events.SubscriptionsRes, users);
                    return;
                }
            }
        });
    }

    getIsSubscribed(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId + '/subscription', (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const result = json.body.result;
                    Bus.emit(Events.UserIsSubscribedRes, result);
                    return;
                }
            }
        });
    }

    makeSubscription(userId: string) {
        fetchPost(ApiUrls.User + '/' + userId + '/subscription', {}, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.SubscribeRes, userId);
                    return;
                }
            }
        });
    }

    unsubscribe(userId: string) {
        fetchDelete(ApiUrls.User + '/' + userId + '/subscription', (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.UnsubscribeRes, userId);
                    return;
                }
            }
        });
    }
}
