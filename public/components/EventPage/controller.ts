import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import EventPageModel from '@event-page/model';
import EventPageView from '@event-page/view';
import {EventData} from '@/types';


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
        Bus.on(Events.UserRes, this.#userResHandle.bind(this));

        const eventId = <string>new URL(window.location.href).searchParams?.get('id');

        this.#model.getEvent(eventId);
    }

    #eventHandle = ((event: EventData) => {
        this.#view.render(event);
    });

    #userResHandle() {
        const eventId = <string>new URL(window.location.href).searchParams?.get('id');
        this.#model.getEvent(eventId);
    }

    #eventDeleteHandle = ((eventId: string) => {
        this.#model.deleteEvent(eventId);
    });

    disable() {
        Bus.off(Events.EventRes, this.#eventHandle);
        Bus.off(Events.EventDelete, this.#eventDeleteHandle);
        this.#view.disable();
    }
}
