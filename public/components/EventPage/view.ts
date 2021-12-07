import { EventData, UrlPathnames, UserData } from '@/types';
import { Loader } from '@googlemaps/js-api-loader';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import Userstore from '../../modules/userstore';
import * as template from '@event-page/templates/eventpage.hbs';
import '@event-page/templates/EventPage.css';

const KEY = process.env.MAPS_API_KEY?.toString();
const PLACES_LIB = 'places';

const ZOOM = 16;

export default class EventPageView {
    #parent: HTMLElement;
    #event?: EventData;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(event: EventData, author: UserData) {
        this.#event = event;

        const permission = (this.#event.authorid === Userstore.get()?.id);
        const unpermission = !permission;
        this.#parent.innerHTML = template({ event, permission, unpermission, author });

        this.#renderMap();

        this.#addListeners();

        Bus.emit(Events.EventFavReq);
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

        const addFavouriteButton = document.getElementById('addFavourite');
        addFavouriteButton?.addEventListener('click', this.#addFavouriteHandle.bind(this));

        const removeFavouriteButton = document.getElementById('removeFavourite');
        removeFavouriteButton?.addEventListener('click', this.#removeFavouriteHandle.bind(this));

        const backButton = document.getElementById('backButton');
        backButton?.addEventListener('click', () => Bus.emit(Events.RouteBack));
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

        const addFavouriteButton = <HTMLElement>document.getElementById('addFavourite');
        if (addFavouriteButton) {
            addFavouriteButton.removeEventListener('click', this.#addFavouriteHandle.bind(this));
        }

        const removeFavouriteButton = <HTMLElement>document.getElementById('removeFavourite');
        if (removeFavouriteButton) {
            removeFavouriteButton.removeEventListener('click', this.#removeFavouriteHandle.bind(this));
        }

        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.removeEventListener('click', () => Bus.emit(Events.RouteBack));
        }
    }

    #editHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.RouteUrl, UrlPathnames.Edit + '?id=' + this.#event?.id);
    });

    #deleteHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.EventDelete, this.#event?.id);
    });

    #addFavouriteHandle(e: Event) {
        e.preventDefault();

        if (!Userstore.get()) {
            Bus.emit(Events.RouteUrl, UrlPathnames.Login);
        } else {
            Bus.emit(Events.EventAddFavReq, this.#event?.id);
        }
    }

    #removeFavouriteHandle(e: Event) {
        e.preventDefault();

        Bus.emit(Events.EventRemoveFavReq, this.#event?.id);
    }

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
        let loader!: Loader;
        if (KEY) {
            loader = new Loader({
                apiKey: KEY,
                libraries: [PLACES_LIB],
            });
        }

        if (loader) {
            void loader.load().then(() => {
                const map = new google.maps.Map(<HTMLElement>document.getElementById('mapContainer'), {
                    zoom: ZOOM,
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
                map.setZoom(ZOOM);
            }).catch(() => {
                const container = <HTMLElement>document.getElementById('mapContainer');
                container.textContent = 'Ошибка подключения к картам';
            });
        }
    }

    renderFavBlock(isFavourite: boolean) {
        const addFavouriteButton = <HTMLElement>document.getElementById('addFavourite');
        const removeFavouriteButton = <HTMLElement>document.getElementById('removeFavourite');

        if (isFavourite) {
            addFavouriteButton?.classList.add('buttons-block-wrapper_none');
            removeFavouriteButton?.classList.remove('buttons-block-wrapper_none');
        } else {
            addFavouriteButton?.classList.remove('buttons-block-wrapper_none');
            removeFavouriteButton?.classList.add('buttons-block-wrapper_none');
        }
    }

}
