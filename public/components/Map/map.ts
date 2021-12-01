import {Loader} from '@googlemaps/js-api-loader';
import './map.css';
import * as template from './map.hbs';
import {EventData} from '@/types';

const MSC_LAT_LNG = {lat: 55.751244, lng: 37.618423};
const ADDRESS_NOT_FOUND = 'Адрес не найден';
const ZOOM = 16;

const KEY = process.env.MAPS_API_KEY?.toString();
const PLACES_LIB = 'places';

export default class MapPopUp {
    #loader?: Loader;
    #parent: HTMLElement;
    #map?: google.maps.Map;
    #loadSuccess: boolean;
    #searchBox?: google.maps.places.SearchBox;
    #eventGeo?: string;
    #bounds?: google.maps.LatLngBounds;
    #marker?: google.maps.Marker;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        this.#loadSuccess = false;
        if (KEY) {
            this.#loader = new Loader({
                apiKey: KEY,
                libraries: [PLACES_LIB],
            });
        }
    }

    render(event?: EventData) {
        this.#eventGeo = event?.geo;
        this.#parent.innerHTML += template(event);
        this.#loadMapAPI();
    }

    #loadMapAPI() {
        void this.#loader?.load().then(() => {
            this.#loadSuccess = true;

            this.#bounds = new google.maps.LatLngBounds();
            let parsedPosition: google.maps.LatLng;

            if (this.#eventGeo) {
                const geo = this.#eventGeo?.replace('(', '');
                const latLng = geo?.split(',', 2);
                const lat = parseFloat(latLng[0]);
                const lng = parseFloat(latLng[1]);
                parsedPosition = new google.maps.LatLng(lat, lng);
            }

            this.#map = new google.maps.Map(<HTMLElement>document.getElementById('mapContainer'), {
                center: MSC_LAT_LNG,
                zoom: ZOOM,
            });

            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const currentPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    this.#map?.setCenter(currentPos);
                    this.#map?.setZoom(ZOOM);

                    if (parsedPosition) {
                        this.#marker = new google.maps.Marker({
                            map: this.#map,
                            position: parsedPosition,
                        });

                        this.#map?.setCenter(parsedPosition);
                        this.#map?.setZoom(ZOOM);
                    }
                });

            this.#addListeners();
        }).catch(() => {
            const container = <HTMLElement>document.getElementById('mapContainer');
            container.textContent = 'Ошибка подключения к картам';
        });
    }

    #addListeners() {
        const input = <HTMLInputElement>document.getElementById('mapInput');
        this.#searchBox = new google.maps.places.SearchBox(input);
        this.#searchBox.addListener('places_changed', this.#handleInputGeo.bind(this));

        const submitButton = <HTMLElement>document.getElementById('mapSubmitButton');
        submitButton.addEventListener('click', this.#handleSubmit.bind(this));

        const cancelButton = <HTMLElement>document.getElementById('mapCancelButton');
        cancelButton.addEventListener('click', this.#handleCancel.bind(this));
    }

    #removeListeners() {
        const submitButton = <HTMLElement>document.getElementById('mapSubmitButton');
        submitButton?.removeEventListener('click', this.#handleSubmit.bind(this));


        const cancelButton = <HTMLElement>document.getElementById('mapCancelButton');
        cancelButton?.removeEventListener('click', this.#handleCancel.bind(this));

    }

    #handleInputGeo() {
        const places = this.#searchBox?.getPlaces();

        if (places?.length != 1) {
            this.#showInputError();
            return;
        }

        const place = places[0];
        const bounds = new google.maps.LatLngBounds();
        this.#marker?.setMap(null);
        this.#marker = new google.maps.Marker({
            map: this.#map,
            title: place.name,
            position: place.geometry?.location,
        });

        if (place.geometry?.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(<google.maps.LatLng>place.geometry?.location);
        }

        this.#map?.fitBounds(bounds);
    }

    #showInputError() {
        const inputError = <HTMLElement>document.getElementById('geoInputError');
        inputError.classList.remove('error_none');
        inputError.textContent = ADDRESS_NOT_FOUND;
    }

    #handleSubmit() {
        const places = this.#searchBox?.getPlaces();

        if (!places || places?.length == 0) {
            this.#showInputError();
            return;
        }

        const geoInput = <HTMLInputElement>document.getElementById('geoInput');
        geoInput.placeholder = <string>places[0].geometry?.location?.toString();
        geoInput.value = <string>places[0].formatted_address;

        const inputError = <HTMLElement>document.getElementById('geoError');
        inputError.classList.add('error_none');

        this.#removeListeners();
        this.#parent.innerHTML = '';
    }

    #handleCancel() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
