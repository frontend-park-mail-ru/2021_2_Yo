import { ApiStatus, ApiUrls, EventData, FetchResponseData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { fetchGet } from './request/request';

class CityStore {
    cities: Set<string>;

    constructor() {
        this.cities = new Set<string>();
        Bus.on(Events.CitiesRes, (cities) => {this.cities = new Set<string>(cities);});
        Bus.on(Events.CityAdd, this.#addCity);
        Bus.on(Events.EventEditReq, this.#handleNewCity);
        Bus.on(Events.EventCreateReq, this.#handleNewCity);
        this.#getCities();
    }

    get() {
        return this.cities;
    }

    #handleNewCity = () => {
        Bus.on(Events.EventRes, this.#handleNewCityDone);
    };

    #handleNewCityDone = (event: EventData) => {
        Bus.off(Events.EventRes, this.#handleNewCityDone);
        if (event['city'].trim() !== '') {
            this.#addCity(event.city);
        }
    };

    #getCities() {
        fetchGet(ApiUrls.Cities, 
            (data: FetchResponseData) => {
                if (data.status === ApiStatus.Ok) {
                    if (data.json.status === ApiStatus.Ok) {
                        Bus.emit(Events.CitiesRes, data.json.body?.cities);
                    }
                }
            },
        );
    }

    #addCity = (city: string) => {
        this.cities.add(city);
    };
}

export default new CityStore();
