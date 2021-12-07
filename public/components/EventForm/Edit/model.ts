import {EventData, ApiUrls, FetchResponseData, UrlPathnames} from '@/types';
import {fetchGet, fetchPost, fetchPostMultipart} from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

type MultipartData = {
    input: Map<string, { errors: string[]; value: string | string[] }>;
    file?: File;
};

export default class EventEditFormModel {
    editEvent(data: MultipartData) {
        const event = {
            title: <string>data['input'].get('title')?.value,
            description: <string>data['input'].get('description')?.value,
            text: <string>data['input'].get('text')?.value,
            city: <string>data['input'].get('city')?.value,
            date: <string>data['input'].get('date')?.value,
            category: <string>data['input'].get('category')?.value,
            tag: <string[]>data['input'].get('tag')?.value,
            geo: <string>data['input'].get('geo')?.value,
        };

        const id = new URL(window.location.href).searchParams.get('id');

        fetchPostMultipart(ApiUrls.Events + '/' + id, {json: event, file: data['file']}, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.RouteUrl, UrlPathnames.Event + '?id=' + id);
                    return;
                }
            }
        });
    }

    getEvent(id: string) {
        fetchGet(ApiUrls.Events + '/' + id,
            (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        const event = <EventData>json.body;
                        Bus.emit(Events.EventRes, event);
                    } else {
                        Bus.emit(Events.RouteUrl, UrlPathnames.Error);
                    }
                }
            }
        );
    }
}
