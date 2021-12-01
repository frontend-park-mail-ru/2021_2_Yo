import { ApiUrls, FetchResponseData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { fetchGet } from './request/request';

class CityStore {
    cities: string[];

    constructor() {
        this.cities = [];
        Bus.on(Events.CitiesRes, (cities) => {this.cities = cities;});
        Bus.on(Events.CityAdd, this.#addCity);
        this.#getCities();
    }

    get() {
        return this.cities;
    }

    #getCities() {
        fetchGet(ApiUrls.Cities, 
            (data: FetchResponseData) => {
                if (data.status === 200) {
                    if (data.json.status === 200) {
                        Bus.emit(Events.CitiesRes, data.json.body?.cities);
                    }
                }
            },
        );
    }

    #addCity = (city: string) => {
        this.cities.push(city);
    };
}

export default new CityStore();
