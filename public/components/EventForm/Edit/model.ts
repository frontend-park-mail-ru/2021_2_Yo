import {EventData, ApiUrls, FetchResponseData, UrlPathnames} from '../../../types.js';
import {fetchGet, fetchPost} from '../../../modules/request/request.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class EventEditFormModel {
    editEvent(inputsData: Map<string, { errors: string[]; value: string | string[] }>) {
        const event: EventData = {
            title: inputsData.get('title')?.value as string,
            description: inputsData.get('description')?.value as string,
            text: inputsData.get('text')?.value as string,
            city: inputsData.get('city')?.value as string,
            date: inputsData.get('date')?.value as string,
            category: inputsData.get('category')?.value as string,
            tag: inputsData.get('tag')?.value as string[],
            geo: inputsData.get('geo')?.value as string
        };

        const id = new URL(window.location.href).searchParams.get('id');

        void fetchPost(ApiUrls.Events + '/' + id, event, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.RouteUrl, UrlPathnames.Event + '?id=' + event.id);
                    return;
                }
            }
        });
    }

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
