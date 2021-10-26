import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import UserStore from '../../modules/userstore.js';
import { fetchGet } from '../../modules/request/request.js';
import { FetchResponseData, ApiUrls } from '../../types.js';

export default class HeaderModel {
    enable() {
        Bus.on(Events.UserReq, this.#userHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
    }

    #userHandle = (() => {
        const stored = UserStore.get();
        console.log(stored);
        if (stored) {
            Bus.emit(Events.UserRes, stored);
        } else {
            void fetchGet(ApiUrls.User, 
                (data: FetchResponseData) => {
                    const {status, json} = data;
                    if (status === 200) {
                        if (json.status === 200) {
                            const user = {name: json.body.name, geo: 'Мытищи'};
                            Bus.emit(Events.UserRes, user);
                        }
                    } 
                },
            );
        }
    }).bind(this);

    #logoutHandle = (() => {
        void fetchGet(ApiUrls.Logout);
    }).bind(this);

    disable() {
        Bus.off(Events.UserReq, this.#userHandle);
        Bus.off(Events.UserLogout, this.#logoutHandle);
    }
}
