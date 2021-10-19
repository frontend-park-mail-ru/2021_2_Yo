import { ApiUrls, EventCardData, FetchResponseData, UserData } from '../../types.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import { fetchGet } from '../../modules/request/request.js';

export default class MainPageModel {
    constructor() {
        Bus.on(Events.EventsReq, this.#eventsHandle);
        Bus.on(Events.UserReq, this.#userHandle);
    }

    #userHandle = (() => {
        void fetchGet(ApiUrls.User, 
            (data: FetchResponseData) => {
                console.log(data);
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        const user: UserData = {name: json.body.name, geo: 'Мытищи'};
                        Bus.emit(Events.UserRes, user);
                    }
                } 
            });
    });

    #eventsHandle = (() => {
        void fetchGet(ApiUrls.Events, 
            (data: FetchResponseData) => {
                console.log(data);
                const {status, json} = data;
                if (status === 200) {
                    if (json.status) {
                        const events = json.body.events as EventCardData[];
                        Bus.emit(Events.EventsRes, events); 
                    }
                }
            });
    });
}