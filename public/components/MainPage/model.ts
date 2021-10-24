import { ApiUrls, EventCardData, FetchResponseData } from '../../types.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import { fetchGet } from '../../modules/request/request.js';

export default class MainPageModel {
    enable() {
        Bus.on(Events.EventsReq, this.#eventsHandle);
        // Bus.on(Events.UserReq, this.#userHandle);
        // Bus.on(Events.UserLogout, this.#logoutHandle);
    }

    // #logoutHandle = () => {
    //     void fetchGet(ApiUrls.Logout);
    // };

    // #userHandle = (() => {
    //     void fetchGet(ApiUrls.User, 
    //         (data: FetchResponseData) => {
    //             const {status, json} = data;
    //             if (status === 200) {
    //                 if (json.status === 200) {
    //                     const user: UserData = {name: json.body.name, geo: 'Мытищи'};
    //                     Bus.emit(Events.UserRes, user);
    //                 }
    //             } 
    //         }
    //     );
    // });

    #eventsHandle = (() => {
        void fetchGet(ApiUrls.Events, 
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status) {
                        const events = <EventCardData[]>json.body.events;
                        Bus.emit(Events.EventsRes, events); 
                        return;
                    }
                }
                Bus.emit(Events.EventsError);
            },
            () => {
                Bus.emit(Events.EventsError);
            }
        );
    });

    disable() {
        Bus.off(Events.EventsReq, this.#eventsHandle);
        // Bus.off(Events.UserReq, this.#userHandle);
        // Bus.off(Events.UserLogout, this.#logoutHandle);
    }
}
