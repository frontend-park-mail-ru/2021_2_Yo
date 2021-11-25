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
        const eventId = new URL(window.location.href).searchParams?.get('id') as string;

        Bus.on(Events.EventRes, this.#eventHandle);
        Bus.on(Events.EventDelete, this.#eventDeleteHandle);

        Bus.on(Events.EventRemoveFavReq, this.#model.removeEventFromFavourite.bind(this, eventId));
        Bus.on(Events.EventRemoveFavRes, this.#getIsFav.bind(this));

        Bus.on(Events.EventAddFavReq, this.#model.addEventToFavourite.bind(this, eventId));
        Bus.on(Events.EventAddFavRes, this.#getIsFav.bind(this));

        Bus.on(Events.EventFavRes, this.#handleFavRes.bind(this));
        Bus.on(Events.EventFavReq, this.#getIsFav.bind(this));

        this.#model.getEvent(eventId);
    }

    #eventHandle = ((event: EventData) => {
        this.#view.render(event);
    });

    #eventDeleteHandle = ((eventId: string) => {
        this.#model.deleteEvent(eventId);
    });


    #handleFavRes(result: boolean) {
        this.#view.renderFavBlock(result);
    }

    #getIsFav() {
        const eventId = new URL(window.location.href).searchParams?.get('id') as string;
        this.#model.isEventFavourite(eventId);
    }

    disable() {
        const eventId = new URL(window.location.href).searchParams?.get('id') as string;
        Bus.off(Events.EventRes, this.#eventHandle);
        Bus.off(Events.EventDelete, this.#eventDeleteHandle);

        Bus.off(Events.EventRemoveFavReq, this.#model.removeEventFromFavourite.bind(this, eventId));
        Bus.off(Events.EventRemoveFavRes, this.#getIsFav.bind(this));

        Bus.off(Events.EventAddFavReq, this.#model.addEventToFavourite.bind(this, eventId));
        Bus.off(Events.EventAddFavRes, this.#getIsFav.bind(this));

        Bus.off(Events.EventFavRes, this.#handleFavRes.bind(this));
        Bus.off(Events.EventFavReq, this.#getIsFav.bind(this));
        this.#view.disable();
    }
}
