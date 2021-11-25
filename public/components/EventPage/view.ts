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

        if (!permission) {
            Bus.emit(Events.EventFavReq, event.id);
        }
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

        const addFavouriteButton = document.getElementById('addFavourite');
        addFavouriteButton?.removeEventListener('click', this.#addFavouriteHandle.bind(this));

        const removeFavouriteButton = document.getElementById('removeFavourite');
        removeFavouriteButton?.removeEventListener('click', this.#removeFavouriteHandle.bind(this));
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

        Bus.emit(Events.EventAddFavReq, this.#event?.id);
    }

    #removeFavouriteHandle(e: Event) {
        e.preventDefault();

        Bus.emit(Events.EventRemoveFavReq, this.#event?.id);
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
