import { ApiUrls, UserData, FetchResponseData } from '../../types.js';
import Bus from '../eventbus/eventbus.js';
import Events from '../eventbus/events.js';
import { fetchGet } from '../request/request.js';

class UserStore {
    #user?: UserData;

    constructor() {
        Bus.on(Events.UserReq, this.#userHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
        Bus.emit(Events.UserReq);
    }

    #userHandle = (() => {
        if (this.#user) {
            Bus.emit(Events.UserRes, this.#user);
            console.log('stored:', this.#user);
        } else {
            void fetchGet(ApiUrls.User, 
                (data: FetchResponseData) => {
                    const {status, json} = data;
                    if (status === 200) {
                        if (json.status === 200) {
                            this.#user = {name: json.body.name, geo: 'Мытищи'};
                            Bus.emit(Events.UserRes, this.#user);
                            console.log('loaded:', this.#user);
                        }
                    } 
                }
            );
        }
    }).bind(this);

    #logoutHandle = (() => {
        this.#user = undefined;
        void fetchGet(ApiUrls.Logout);
    }).bind(this);
}

export default UserStore;
