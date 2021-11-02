import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import UserStore from '@modules/userstore';
import {fetchGet} from '@request/request';
import {ApiUrls, FetchResponseData, UserData} from '@/types';

const user = {
    id: '1',
    name: 'Vasya',
    surname: 'Vash',
    description: 'ya',
    email: 'lala@bebe.ru',
    geo: 'Moscow',
};

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
                    const {status, json} = data;
                    if (status === 200) {
                        if (json.status === 200) {
                            const user = <UserData>json.body;
                            Bus.emit(Events.UserRes, user);
                            return;
                        }
                    }
                    // Bus.emit(Events.UserError);
                    Bus.emit(Events.UserRes, user);
                },
                () => {
                    // Bus.emit(Events.UserError);
                    Bus.emit(Events.UserRes, user);
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
