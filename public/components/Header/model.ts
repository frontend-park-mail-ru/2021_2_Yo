import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import UserStore from '@modules/userstore';
import { fetchGet, fetchPost } from '@request/request';
import { ApiStatus, ApiUrls, FetchResponseData, UserData, Notification } from '@/types';

export default class HeaderModel {
    #notifications: Notification[] = [];
    #ws?: WebSocket;

    enable() {
        Bus.on(Events.UserReq, this.#userHandle);
        Bus.on(Events.UserNotificationsReq, this.#notificationsReqHandle);
        Bus.on(Events.UserNotificationsSeen, this.#notificationsSeenHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
    }

    #wsOpen() {
        this.#ws = new WebSocket('wss://bmstusa.ru/ws');
        this.#ws.addEventListener('open', this.#wsOpenHandle);
        this.#ws.addEventListener('message', this.#wsMessageHandle);
        this.#ws.addEventListener('close', this.#wsCloseHandle);
    }

    #wsOpenHandle = () => {
        const user = UserStore.get();
        if (!user) return;
        this.#ws?.send(JSON.stringify({ id: user['id'] }));
    };

    #wsMessageHandle = (event: MessageEvent) => {
        const data = JSON.parse(event['data']);
        this.#notifications.unshift(data);
        Bus.emit(Events.UserNotificationsRes, this.#notifications);
    };

    #wsCloseHandle = () => {
    };

    #notificationsReqHandle = () => {
        fetchGet(ApiUrls.Notifications,
            (data: FetchResponseData) => {
                const { status, json } = data;
                if (status === ApiStatus.Ok) {
                    if (json.status === ApiStatus.Ok) {
                        const notifications: Notification[] = json.body.notifications;
                        this.#notifications = notifications;
                        Bus.emit(Events.UserNotificationsRes, notifications);
                    }
                }
            }
        );
    };

    #notificationsSeenHandle = () => {
        this.#notifications = this.#notifications.map((notification) => {
            notification['seen'] = true;
            return notification;
        });
        fetchPost(ApiUrls.Notifications,
            undefined,
            () => {},
        );
    };

    #userHandle = () => {
        const stored = UserStore.get();
        if (stored) {
            Bus.emit(Events.UserRes, stored);
        } else {
            fetchGet(ApiUrls.User,
                (data: FetchResponseData) => {
                    const { status, json, headers } = data;
                    if (status === ApiStatus.Ok) {
                        if (json.status === ApiStatus.Ok) {
                            const user = <UserData>json.body;
                            Bus.emit(Events.UserRes, user);
                            this.#wsOpen();
                            Bus.emit(Events.UserNotificationsReq);

                            const token = headers?.get('X-CSRF-Token');
                            if (token) {
                                Bus.emit(Events.CSRFRes, token);
                            }
                            return;
                        }
                    }
                    Bus.emit(Events.UserError);
                },
                () => {
                    Bus.emit(Events.UserError);
                }
            );
        }
    };

    #logoutHandle = () => {
        void fetchGet(ApiUrls.Logout);
        Bus.emit(Events.CSRFDelete);
    };

    disable() {
        Bus.off(Events.UserReq, this.#userHandle);
        Bus.off(Events.UserLogout, this.#logoutHandle);
        Bus.off(Events.UserNotificationsReq, this.#notificationsReqHandle);
        Bus.off(Events.UserNotificationsSeen, this.#notificationsSeenHandle);
    }
}
