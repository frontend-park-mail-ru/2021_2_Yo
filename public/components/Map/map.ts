import {Loader} from '@googlemaps/js-api-loader';
import './map.css';
import * as template from './map.hbs';
import {EventData} from '@/types';

const KEY = 'AIzaSyA9qUUP6w_uqsJWrvDcPIfY8oBnIigjAT4';
const MSC_LAT_LNG = {lat: 55.751244, lng: 37.618423};

export default class MapPopUp {
    #loader: Loader;
    #parent: HTMLElement;
    #map?: google.maps.Map;
    #loadSuccess: boolean;
    #searchBox?: google.maps.places.SearchBox;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        this.#loadSuccess = false;
        this.#loader = new Loader({
            apiKey: KEY,
            libraries: ['places'],
        });
    }

    render(event?: EventData) {
        this.#parent.innerHTML += template(event);
        this.#loadMapAPI();
    }

    #loadMapAPI() {
        void this.#loader.load().then(() => {
            this.#loadSuccess = true;

            let currentPos = MSC_LAT_LNG;
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    currentPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    this.#map = new google.maps.Map(<HTMLElement>document.getElementById('mapContainer'), {
                        center: currentPos,
                        zoom: 16,
                    });
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
    }

    #handleInputGeo() {
        const places = this.#searchBox?.getPlaces();

        if (places?.length == 0) {
            this.#showInputError();
            return;
        }


    }

    #showInputError() {
        const inputError = <HTMLElement>document.getElementById('geoInputError');
        inputError.textContent = 'Адрес не найден';
    }
}


// map.addListener('bounds_changed', () => {
//     searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
// });
//
// searchBox.addListener('places_changed', () => {
//
// });

// Clear out the old markers.
// this.#markers.forEach((marker) => {
//     marker.setMap(null);
// });
// this.#markers = [];
//
// For each place, get the icon, name and location.
// const bounds = new google.maps.LatLngBounds();
//
// places?.forEach((place) => {
//     if (!place.geometry || !place.geometry.location) {
//         console.log('Returned place contains no geometry');
//         return;
//     }
//
// Create a marker for each place.
//     this.#markers.push(
//         new google.maps.Marker({
//             map,
//             title: place.name,
//             position: place.geometry.location,
//         })
//     );
//
//     if (place.geometry.viewport) {
// Only geocodes have viewport.
//         bounds.union(place.geometry.viewport);
//     } else {
//         bounds.extend(place.geometry.location);
//     }
// });
// map.fitBounds(bounds);
