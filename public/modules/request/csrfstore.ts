import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

class CSRFStore {
    #token?: string;

    constructor() {
        Bus.on(Events.CSRFRes, this.#csrfGetHandle);
        Bus.on(Events.CSRFDelete, this.#csrfDeleteHandle);
    }

    get() {
        console.log('запрос токена', this.#token);
        return this.#token;
    }

    #csrfGetHandle = ((token: string) => {
        this.#token = token;
        console.log('проставлен токен', this.#token);
    }).bind(this);

    #csrfDeleteHandle = (() => {
        this.#token = undefined;
        console.log('удален токен', this.#token);
    }).bind(this);
}

export default new CSRFStore();
