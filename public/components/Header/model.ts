import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import UserStore from '@modules/userstore';
import {fetchGet} from '@request/request';
import {ApiUrls, FetchResponseData, UserData} from '@/types';

export default class HeaderModel {
    enable() {
        Bus.on(Events.UserReq, this.#userHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
    }

    #userHandle = (() => {
        const stored = UserStore.get();
        if (stored) {
            Bus.emit(Events.UserRes, stored);
        } else {
            fetchGet(ApiUrls.User,
                (data: FetchResponseData) => {
                    const {status, json, headers} = data;
                    if (status === 200) {
                        if (json.status === 200) {
                            const user = <UserData>json.body;
                            Bus.emit(Events.UserRes, user);

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
    }).bind(this);

    #logoutHandle = (() => {
        void fetchGet(ApiUrls.Logout);
        Bus.emit(Events.CSRFDelete);
    }).bind(this);

    disable() {
        Bus.off(Events.UserReq, this.#userHandle);
        Bus.off(Events.UserLogout, this.#logoutHandle);
    }
}
