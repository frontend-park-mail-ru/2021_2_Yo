import { ApiUrls, UserData, FetchResponseData } from '../../types.js';
import Bus from '../eventbus/eventbus.js';
import Events from '../eventbus/events.js';
import { fetchGet } from '../request/request.js';

class UserStore {
    // Если undefined - надо сходить за данными
    //      null - данные уже запрошены
    //      UserData - данные сохранены, можно отдать сразу
    #user: UserData | null | undefined;

    constructor() {
        Bus.on(Events.UserReq, this.#userHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
        Bus.emit(Events.UserReq);
    }

    #userHandle = (() => {
        if (this.#user === null) {
            return;
        }

        if (this.#user) {
            Bus.emit(Events.UserRes, this.#user);
            console.log('stored:', this.#user);
        } else {
            this.#user = null;
            void fetchGet(ApiUrls.User, 
                (data: FetchResponseData) => {
                    const {status, json} = data;
                    if (status === 200) {
                        if (json.status === 200) {
                            this.#user = {name: json.body.name, geo: 'Мытищи'};
                            Bus.emit(Events.UserRes, this.#user);
                            console.log('loaded:', this.#user);
                            return;
                        }
                    } 
                    this.#user = undefined;
                },
                () => this.#user = undefined
            );

        }
    }).bind(this);

    #logoutHandle = (() => {
        this.#user = undefined;
        void fetchGet(ApiUrls.Logout);
    }).bind(this);
}

export default UserStore;
