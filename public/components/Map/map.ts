import {Loader} from '@googlemaps/js-api-loader';
import './map.css';
import * as template from './map.hbs';
import {EventData} from '@/types';

const KEY = 'AIzaSyA9qUUP6w_uqsJWrvDcPIfY8oBnIigjAT4';

export default class MapPopUp {
    #loader: Loader;
    #parent: HTMLElement;
    #markers: google.maps.Marker[] = [];

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        this.#loader = new Loader({
            apiKey: KEY,
            libraries: ['places'],
        });
    }

    render(event: EventData) {
        this.#parent.innerHTML += template(event);

        this.#loadMapAPI();
    }

    #loadMapAPI() {
        void this.#loader.load().then(() => {
            const map = new google.maps.Map(<HTMLElement>document.getElementById('mapContainer'), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8,
            });

            const input = <HTMLInputElement>document.getElementById('mapInput');
            const searchBox = new google.maps.places.SearchBox(input);

            map.addListener('bounds_changed', () => {
                searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
            });

            searchBox.addListener('places_changed', () => {
                const places = searchBox.getPlaces();

                if (places?.length == 0) {
                    return;
                }

                // Clear out the old markers.
                this.#markers.forEach((marker) => {
                    marker.setMap(null);
                });
                this.#markers = [];

                // For each place, get the icon, name and location.
                const bounds = new google.maps.LatLngBounds();

                places?.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) {
                        console.log('Returned place contains no geometry');
                        return;
                    }

                    // Create a marker for each place.
                    this.#markers.push(
                        new google.maps.Marker({
                            map,
                            title: place.name,
                            position: place.geometry.location,
                        })
                    );

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });
        });
    }
}
