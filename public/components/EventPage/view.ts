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

        this.#addListeners();
    }

    #addListeners() {
        const editButton = document.getElementById('editButton');
        editButton?.addEventListener('click', this.#editHandle);

        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.addEventListener('click', this.#deleteHandle);
    }

    #removeListeners() {
        const editButton = document.getElementById('editButton');
        editButton?.removeEventListener('click', this.#editHandle);

        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.addEventListener('click', this.#deleteHandle);
    }

    #editHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.RouteUrl, UrlPathnames.Edit + '?id=' + this.#event?.id);
    }).bind(this);

    #deleteHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.EventDelete, this.#event?.id);
    }).bind(this);

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
