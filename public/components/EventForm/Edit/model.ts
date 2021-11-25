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
            title: data['input'].get('title')?.value as string,
            description: data['input'].get('description')?.value as string,
            text: data['input'].get('text')?.value as string,
            city: data['input'].get('city')?.value as string,
            date: data['input'].get('date')?.value as string,
            category: data['input'].get('category')?.value as string,
            tag: data['input'].get('tag')?.value as string[],
            geo: data['input'].get('geo')?.value as string
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
                        const event = json.body as EventData;
                        Bus.emit(Events.EventRes, event);
                    } else {
                        Bus.emit(Events.RouteUrl, UrlPathnames.Error);
                    }
                }
            }
        );
    }
}
