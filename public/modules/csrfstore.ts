import Bus from './eventbus/eventbus.js';
import Events from './eventbus/events.js';

class CSRFStore {
    #token?: string;

    constructor() {
        Bus.on(Events.CSRFRes, this.#csrfGetHandle);
        Bus.on(Events.CSRFDelete, this.#csrfDeleteHandle);
    }

    get() {
        return this.#token;
    }

    #csrfGetHandle = ((token: string) => {
        this.#token = token;
        console.log('token store', this.#token);
    }).bind(this);

    #csrfDeleteHandle = (() => {
        this.#token = undefined;
    }).bind(this);
}

export default new CSRFStore();
