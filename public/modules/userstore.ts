import { UserData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

class UserStore {
    #user?: UserData;

    constructor() {
        Bus.on(Events.UserRes, this.#userHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
    }

    get() {
        return this.#user;
    }

    #userHandle = ((user: UserData) => {
        this.#user = user;
    }).bind(this);

    #logoutHandle = (() => {
        this.#user = undefined;
    }).bind(this);
}

export default new UserStore();
