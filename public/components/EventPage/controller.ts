import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import EventPageModel from '@event-page/model';
import EventPageView from '@event-page/view';
import { EventData, UserData } from '@/types';

export default class EventPageController {
    #view: EventPageView;
    #model: EventPageModel;
    #event?: EventData;

    constructor(parent: HTMLElement) {
        this.#view = new EventPageView(parent);
        this.#model = new EventPageModel();
    }

    enable() {
        const eventId = <string>new URL(window.location.href).searchParams?.get('id');

        Bus.on(Events.EventRes, this.#eventHandle);
        Bus.on(Events.EventDelete, this.#eventDeleteHandle);
        Bus.on(Events.EventAuthorRes, this.#authorHandle);

        Bus.on(Events.EventRemoveFavReq, this.#removeReqHandle);
        Bus.on(Events.EventRemoveFavRes, this.#getIsFav);

        Bus.on(Events.EventAddFavReq, this.#addReqHandle);
        Bus.on(Events.EventAddFavRes, this.#getIsFav);

        Bus.on(Events.EventFavRes, this.#handleFavRes);
        Bus.on(Events.EventFavReq, this.#getIsFav);

        this.#model.getEvent(eventId);
    }

    #addReqHandle = ((eventId: string) => {
        this.#model.addEventToFavourite(eventId);
    });

    #removeReqHandle = ((eventId: string) => {
        this.#model.removeEventFromFavourite(eventId);
    });

    #eventHandle = ((event: EventData) => {
        this.#event = event;
        this.#model.getAuthor(event.authorid);
    });

    #authorHandle = ((author: UserData) => {
        this.#view.render(<EventData>this.#event, author);
    });

    #eventDeleteHandle = ((eventId: string) => {
        this.#model.deleteEvent(eventId);
    });

    #handleFavRes = ((result: boolean) => {
        this.#view.renderFavBlock(result);
    });

    #getIsFav = (() => {
        const eventId = <string>new URL(window.location.href).searchParams?.get('id');
        this.#model.isEventFavourite(eventId);
    });

    disable() {
        Bus.off(Events.EventRes, this.#eventHandle);
        Bus.off(Events.EventDelete, this.#eventDeleteHandle);
        Bus.off(Events.EventAuthorRes, this.#authorHandle);

        Bus.off(Events.EventRemoveFavReq, this.#removeReqHandle);
        Bus.off(Events.EventRemoveFavRes, this.#getIsFav);

        Bus.off(Events.EventAddFavReq, this.#addReqHandle);
        Bus.off(Events.EventAddFavRes, this.#getIsFav);

        Bus.off(Events.EventFavRes, this.#handleFavRes);
        Bus.off(Events.EventFavReq, this.#getIsFav);

        this.#view.disable();
    }
}
