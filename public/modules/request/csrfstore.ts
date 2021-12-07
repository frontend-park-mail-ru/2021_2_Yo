import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

class CSRFStore {
    #token?: string;

    constructor() {
        Bus.on(Events.CSRFRes, this.#csrfGetHandle);
        Bus.on(Events.CSRFDelete, this.#csrfDeleteHandle);
    }

    get() {
        return this.#token;
    }

    #csrfGetHandle = (token: string) => {
        this.#token = token;
    };

    #csrfDeleteHandle = () => {
        this.#token = undefined;
    };
}

export default new CSRFStore();
