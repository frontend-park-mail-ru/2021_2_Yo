export enum Events {
    UserSignup = 'user:signup',
    UserLogin = 'user:login',
    EventsGet = 'events:get',
}

class EventBus {
    #listeners: Record<string, ((args?: any)=>void)[]>;

    constructor() {
        this.#listeners = {};
    }
    
    on(event: Events, callback: (args?: any)=>void) {
        (this.#listeners[event] || (this.#listeners[event] = [])).push(callback);
    }
    off(event: Events, callback: (args?: any)=>void) {
        this.#listeners[event] = this.#listeners[event]
            .filter((listener) => { return listener !== callback;});
    }
    emit(event: Events, data: any) {
        this.#listeners[event].forEach(
            (listener) => {
                listener(data);
            }
        );
    }
}

export default new EventBus();
