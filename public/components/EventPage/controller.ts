import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import EventPageModel from '@event-page/model';
import EventPageView from '@event-page/view';
import {EventData} from '@/types';

export default class EventPageController {
    #view: EventPageView;
    #model: EventPageModel;
    #eventId?: string;

    constructor(parent: HTMLElement) {
        this.#view = new EventPageView(parent);
        this.#model = new EventPageModel();
    }

    enable() {
        this.#eventId = new URL(window.location.href).searchParams?.get('id') as string;

        Bus.on(Events.EventRes, this.#eventHandle);
        Bus.on(Events.EventDelete, this.#eventDeleteHandle);

        Bus.on(Events.EventRemoveFavReq, this.#removeFavHandle);
        Bus.on(Events.EventRemoveFavRes, this.#getIsFav);

        Bus.on(Events.EventAddFavReq, this.#addFavHandle);
        Bus.on(Events.EventAddFavRes, this.#getIsFav);

        Bus.on(Events.EventFavRes, this.#handleFavRes.bind(this));
        Bus.on(Events.EventFavReq, this.#getIsFav);

        this.#model.getEvent(this.#eventId);
    }

    #removeFavHandle = (id: string) => {
        this.#model.removeEventFromFavourite(id);
    };

    #addFavHandle = (id: string) => {
        this.#model.addEventToFavourite(id);
    };

    #eventHandle = ((event: EventData) => {
        this.#view.render(event);
    });

    #eventDeleteHandle = ((eventId: string) => {
        this.#model.deleteEvent(eventId);
    });

    #handleFavRes(result: boolean) {
        this.#view.renderFavBlock(result);
    }

    #getIsFav = (id: string) => {
        this.#model.isEventFavourite(id);
    };

    disable() {
        Bus.off(Events.EventRes, this.#eventHandle);
        Bus.off(Events.EventDelete, this.#eventDeleteHandle);

        Bus.off(Events.EventRemoveFavReq, this.#removeFavHandle);
        Bus.off(Events.EventRemoveFavRes, this.#getIsFav);

        Bus.off(Events.EventAddFavReq, this.#addFavHandle);
        Bus.off(Events.EventAddFavRes, this.#getIsFav);

        Bus.off(Events.EventFavRes, this.#handleFavRes.bind(this));
        Bus.off(Events.EventFavReq, this.#getIsFav);
        this.#view.disable();
    }
}
