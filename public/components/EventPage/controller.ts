import EventPageView from './view.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import EventPageModel from './model.js';
import {EventData} from '../../types.js';

export default class EventPageController {
    #view: EventPageView;
    #model: EventPageModel;

    constructor(parent: HTMLElement) {
        this.#view = new EventPageView(parent);
        this.#model = new EventPageModel();
    }

    enable() {
        Bus.on(Events.EventRes, this.#eventHandle);
        Bus.on(Events.EventDelete, this.#eventDeleteHandle);

        const eventId = new URL(window.location.href).searchParams?.get('id') as string;
        this.#model.getEvent(eventId);
    }

    #eventHandle = ((event: EventData) => {
        this.#view.render(event);
    });

    #eventDeleteHandle = ((eventId: string) => {
        this.#model.deleteEvent(eventId);
    });

    disable() {
        Bus.off(Events.EventRes, this.#eventHandle);
        this.#view.disable();
    }
}
