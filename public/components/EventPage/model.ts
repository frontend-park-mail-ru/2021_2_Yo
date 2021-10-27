import {fetchGet} from '../../modules/request/request.js';
import {ApiUrls, EventData, FetchResponseData} from '../../types.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';

export default class EventPageModel {
    getEvent(id: string) {
        void fetchGet(ApiUrls.Events + '/' + id,
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        const event: EventData = {
                            id: json.body.id,
                            city: json.body.city,
                            category: json.body.category,
                            title: json.body.title,
                            viewed: json.body.viewed,
                            description: json.body.description,
                            tag: json.body.tag,
                            text: json.body.text,
                            date: json.body.date,
                            geo: json.body.geo
                        };
                        Bus.emit(Events.EventRes, event);
                    }
                }
            }
        );
    }
}
