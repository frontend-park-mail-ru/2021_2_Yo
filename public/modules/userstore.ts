import {ApiUrls, UserData, FetchResponseData} from '../types.js';
import Bus from './eventbus/eventbus.js';
import Events from './eventbus/events.js';

class UserStore {
    #user?: UserData;

    constructor() {
        Bus.on(Events.UserRes, this.#userHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
    }

    get() {
        return this.#user;
    }

    set(user: UserData) {
        this.#user = user;
    }

    #userHandle = ((user: UserData) => {
        this.#user = user;
        console.log('Из юзер стора', this.#user);
    }).bind(this);

    #logoutHandle = (() => {
        this.#user = undefined;
    }).bind(this);
}

export default new UserStore();
