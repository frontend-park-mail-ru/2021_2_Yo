import {EventData, ApiUrls, FetchResponseData, UrlPathnames} from '@/types';
import {fetchPost} from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

export default class EventFormModel {
    createEvent(inputsData: Map<string, { errors: string[], value: string | string[] }>) {
        const event= {
            title: inputsData.get('title')?.value as string,
            description: inputsData.get('description')?.value as string,
            text: inputsData.get('text')?.value as string,
            city: inputsData.get('city')?.value as string,
            date: inputsData.get('date')?.value as string,
            category: inputsData.get('category')?.value as string,
            tag: inputsData.get('tag')?.value as string[],
            geo: inputsData.get('geo')?.value as string
        };

        fetchPost(ApiUrls.Events, event, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.RouteUrl, UrlPathnames.Event + '?id=' + json.body.id);
                    return;
                }
            }
        });
    }
}
