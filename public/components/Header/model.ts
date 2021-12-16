import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import UserStore from '@modules/userstore';
import { fetchGet } from '@request/request';
import { ApiStatus, ApiUrls, FetchResponseData, UserData } from '@/types';

export default class HeaderModel {
    #notifications: any[] = [];
    #ws?: WebSocket;

    enable() {
        Bus.on(Events.UserReq, this.#userHandle);
        Bus.on(Events.UserNotificationsReq, this.#notificationsHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
    }

    #wsOpen() {
        // fetchGet(ApiUrls.WebSocket,
        //     (data: FetchResponseData) => {
        //         const { status, json } = data;
        //         if (status === ApiStatus.Ok) {
        //             if (json.status === ApiStatus.Ok) {
        //                 this.#ws = new WebSocket('ws://bmstusa.ru');
        //                 this.#ws.addEventListener('open', this.#wsOpenHandle);
        //                 this.#ws.addEventListener('message', this.#wsMessageHandle);
        //             }
        //         }
        //     }
        // );
        this.#ws = new WebSocket('wss://bmstusa.ru/ws');
        this.#ws.addEventListener('open', this.#wsOpenHandle);
        this.#ws.addEventListener('message', this.#wsMessageHandle);
        this.#ws.addEventListener('close', this.#wsCloseHandle);
    }

    #wsOpenHandle = () => {
        // console.log('opened');
        const user = UserStore.get();
        if (!user) return;
        this.#ws?.send(JSON.stringify({ id: user['id'] }));
    };

    #wsMessageHandle = (event: MessageEvent) => {
        // console.log('new message');
        const data = JSON.parse(event['data']);
        // console.log(data);
        this.#notifications.unshift(data);
        // console.log(this.#notifications);
        Bus.emit(Events.UserNotificationsRes, this.#notifications);
    };

    #wsCloseHandle = () => {
        // console.log('CLOSED');
    };

    #notificationsHandle = () => {
        fetchGet(ApiUrls.Notifications,
            (data: FetchResponseData) => {
                const { status, json } = data;
                if (status === ApiStatus.Ok) {
                    if (json.status === ApiStatus.Ok) {
                        const notifications: any[] = json.body.notifications;
                        this.#notifications = notifications;
                        Bus.emit(Events.UserNotificationsRes, notifications);
                    }
                }
            }
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
        Bus.off(Events.UserNotificationsReq, this.#notificationsHandle);
    }
}
