import {EventData, UrlPathnames} from '@/types';
import {Loader} from '@googlemaps/js-api-loader';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import Userstore from '../../modules/userstore';
import * as template from '@event-page/templates/eventpage.hbs';
import '@event-page/templates/EventPage.css';

const KEY = process.env.MAPS_API_KEY?.toString();

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

        this.#renderMap();

        this.#addListeners();
    }

    #addListeners() {
        const editButton = document.getElementById('editButton');
        editButton?.addEventListener('click', this.#editHandle);

        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.addEventListener('click', this.#deleteHandle);

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.addEventListener('click', this.#hideEditPopup.bind(this));

        const popupOpenButton = <HTMLElement>document.getElementById('popupOpen');
        popupOpenButton?.addEventListener('click', this.#showEditPopup.bind(this));
    }

    #removeListeners() {
        const editButton = document.getElementById('editButton');
        editButton?.removeEventListener('click', this.#editHandle);

        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.removeEventListener('click', this.#deleteHandle);

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.removeEventListener('click', this.#hideEditPopup.bind(this));

        const popupOpenButton = <HTMLElement>document.getElementById('popupOpen');
        popupOpenButton?.removeEventListener('click', this.#showEditPopup.bind(this));
    }

    #editHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.RouteUrl, UrlPathnames.Edit + '?id=' + this.#event?.id);
    }).bind(this);

    #deleteHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.EventDelete, this.#event?.id);
    }).bind(this);

    #hideEditPopup() {
        const popup = document.getElementById('editPopup');
        popup?.classList.add('edit-popup_none');

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.classList.add('edit-popup_none');
    }

    #showEditPopup() {
        const popup = document.getElementById('editPopup');
        popup?.classList.remove('edit-popup_none');

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.classList.remove('edit-popup_none');
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }

    #renderMap() {
        const loader = new Loader({
            apiKey: <string>KEY,
            libraries: ['places'],
        });

        void loader.load().then(() => {
            const map = new google.maps.Map(<HTMLElement>document.getElementById('mapContainer'), {
                zoom: 16,
            });

            const geo = this.#event?.geo.replace('(', '');
            const latLng = <string[]>geo?.split(',', 2);
            const lat = parseFloat(latLng[0]);
            const lng = parseFloat(latLng[1]);
            const parsedPosition = new google.maps.LatLng(lat, lng);

            const marker = new google.maps.Marker({
                map: map,
                title: this.#event?.title,
                position: parsedPosition,
            });

            map.setCenter(parsedPosition);
            map.setZoom(16);
        }).catch((reason: string) => {
            const container = <HTMLElement>document.getElementById('mapContainer');
            container.textContent = 'Ошибка подключения к картам: ' + reason;
        });
    }
}
