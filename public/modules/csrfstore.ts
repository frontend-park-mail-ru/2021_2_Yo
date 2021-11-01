import Bus from './eventbus/eventbus.js';
import Events from './eventbus/events.js';

class CSRFStore {
    #token?: string;

    constructor() {
        Bus.on(Events.CSRFRes, this.#csrfGetHandle);
        Bus.on(Events.CSRFDelete, this.#csrfDeleteHandle);
    }

    get() {
        console.log('token store', this.#token);
        return this.#token;
    }

    #csrfGetHandle = ((token: string) => {
        this.#token = token;
        console.log(this.#token);
    }).bind(this);

    #csrfDeleteHandle = (() => {
        this.#token = undefined;
        console.log('delete',this.#token);
    }).bind(this);
}

export default new CSRFStore();
