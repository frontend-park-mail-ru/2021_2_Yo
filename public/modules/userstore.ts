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

    reset() {
        this.#user = undefined;
    }

    #userHandle = (user: UserData) => {
        this.#user = user;
    };

    #logoutHandle = () => {
        this.#user = undefined;
    };
}

export default new UserStore();
