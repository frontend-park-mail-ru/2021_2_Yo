import {EventData, ApiUrls, FetchResponseData, UrlPathnames} from '@/types';
import {fetchGet, fetchPost} from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

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
                    Bus.emit(Events.RouteUrl, UrlPathnames.Event + '?id=' + id);
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
                        const event = json.body as EventData;
                        Bus.emit(Events.EventRes, event);
                    }
                }
            }
        );
    }
}
