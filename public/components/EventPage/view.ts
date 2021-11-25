import {EventData, UrlPathnames} from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import Userstore from '../../modules/userstore';
import * as template from '@event-page/templates/eventpage.hbs';
import '@event-page/templates/EventPage.css';

export default class EventPageView {
    #parent: HTMLElement;
    #event?: EventData;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(event: EventData) {
        this.#event = event;

        const permission = (this.#event.authorid === Userstore.get()?.id);
        this.#parent.innerHTML = template({event, permission});

        if (!permission) {
            Bus.emit(Events.EventFavReq);
        }

        this.#addListeners();
    }

    #addListeners() {
        const editButton = document.getElementById('editButton');
        editButton?.addEventListener('click', this.#editHandle);

        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.addEventListener('click', this.#deleteHandle);

        const addFavouriteButton = document.getElementById('addFavourite');
        addFavouriteButton?.addEventListener('click', this.#addFavouriteHandle.bind(this));

        const removeFavouriteButton = document.getElementById('removeFavourite');
        removeFavouriteButton?.addEventListener('click', this.#removeFavouriteHandle.bind(this));

    }

    #removeListeners() {
        const editButton = document.getElementById('editButton');
        editButton?.removeEventListener('click', this.#editHandle);

        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.removeEventListener('click', this.#deleteHandle);

        const addFavouriteButton = <HTMLElement>document.getElementById('addFavourite');
        if (addFavouriteButton) {
            addFavouriteButton.removeEventListener('click', this.#addFavouriteHandle.bind(this));
        }

        const removeFavouriteButton = <HTMLElement>document.getElementById('removeFavourite');
        if (removeFavouriteButton) {
            removeFavouriteButton.removeEventListener('click', this.#removeFavouriteHandle.bind(this));
        }
    }

    #editHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.RouteUrl, UrlPathnames.Edit + '?id=' + this.#event?.id);
    }).bind(this);

    #deleteHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.EventDelete, this.#event?.id);
    }).bind(this);

    #addFavouriteHandle(e: Event) {
        e.preventDefault();

        Bus.emit(Events.EventAddFavReq);
    }

    #removeFavouriteHandle(e: Event) {
        e.preventDefault();

        Bus.emit(Events.EventRemoveFavReq);
    }

    renderFavBlock(isFavourite: boolean) {
        const favBlock = <HTMLElement>document.getElementById('favBlock');
        favBlock.classList.remove('button_none');

        const addFavouriteButton = <HTMLElement>document.getElementById('addFavourite');
        const removeFavouriteButton = <HTMLElement>document.getElementById('removeFavourite');

        if (addFavouriteButton && removeFavouriteButton) {
            if (isFavourite) {
                addFavouriteButton.classList.add('button_none');
                removeFavouriteButton.classList.remove('button_none');
            } else {
                addFavouriteButton.classList.remove('button_none');
                removeFavouriteButton.classList.add('button_none');
            }
        }
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
