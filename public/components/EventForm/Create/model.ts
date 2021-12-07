import {ApiStatus, ApiUrls, FetchResponseData, UrlPathnames} from '@/types';
import {fetchPostMultipart} from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

type MultipartData = {
    input: Map<string, { errors: string[], value: string | string[] }>;
    file?: File;
};

export default class EventFormModel {
    createEvent(data: MultipartData) {
        const event= {
            title: <string>data['input'].get('title')?.value,
            description: <string>data['input'].get('description')?.value,
            text: <string>data['input'].get('text')?.value,
            city: <string>data['input'].get('city')?.value,
            date: <string>data['input'].get('date')?.value,
            category: <string>data['input'].get('category')?.value,
            tag: <string[]>data['input'].get('tag')?.value,
            geo: <string>data['input'].get('geo')?.value,
        };

        fetchPostMultipart(ApiUrls.Events, {json: event, file: data['file']}, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    Bus.emit(Events.RouteUrl, UrlPathnames.Event + '?id=' + json.body.id);
                    return;
                }
            }
        });
    }
}
