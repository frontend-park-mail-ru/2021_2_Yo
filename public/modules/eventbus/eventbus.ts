import Events from './events.js';

class EventBus {
    #listeners: Record<string, ((args?: any) => void)[]>;

    constructor() {
        this.#listeners = {};
    }
    
    on(event: Events, callback: (args: any)=>void) {
        (this.#listeners[event] || (this.#listeners[event] = [])).push(callback);
    }

    off(event: Events, callback: (args: any)=>void) {
        this.#listeners[event] = this.#listeners[event]
            .filter((listener) => { return listener !== callback;});
    }

    emit(event: Events, args?: any) {
        this.#listeners[event]?.forEach(
            (listener) => {
                listener(args);
            }
        );
    }
}

export default new EventBus();
