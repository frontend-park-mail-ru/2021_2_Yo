import {EventData, ApiUrls, FetchResponseData, UrlPathnames} from '../../types.js';
import {fetchPost} from '../../modules/request/request.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';

export default class EventFormModel {
    createEvent(event: EventData) {
        console.log(event);
        void fetchPost(ApiUrls.Events, event, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    // bus.emit(Events.UserAuthorized, null);
                    Bus.emit(Events.RouteUrl, UrlPathnames.Event + '?id=' + json.body.id);
                    return;
                }
            }
            console.log('не ок');
        });
    }
}
