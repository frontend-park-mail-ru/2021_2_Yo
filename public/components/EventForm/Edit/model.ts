import {EventData, ApiUrls, FetchResponseData, UrlPathnames} from '../../../types.js';
import {fetchGet, fetchPost} from '../../../modules/request/request.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

const event = {
    id: 1,
    city: 'Москва',
    category: 'Тусовка',
    viewed: 1094,
    title: 'Невероятная тусовка в Кремле',
    description: 'Небольшое описание мероприятия. Да, реально крутая тусовка. Да, говорю. Круто будет, говорю, весело.\n' +
        '         Всем ясно? Тусовка. Тусовка. Тусовка. Тусовка. Тусовка. Тусовка. Этот прямоугольник должен\n' +
        '         сжиматься/расширяться в зависимости от длины текста (количества строк).',
    tag: ['Вечеринка', 'Тусовка', 'Party', 'Alcohol'],
    text: 'But I must explain to you how all this mistaken idea of denouncing\n' +
        '                pleasure and praising pain was born and I will give you a complete account of the system, ' +
        'and expound the actual\n' +
        '                teachings of the great explorer of the truth, the master-builder of human happiness. ' +
        'No one rejects, dislikes,\n' +
        '               or avoids pleasure itself, because it is pleasure, but because those who do not know ' +
        'how to pursue pleasure\n' +
        '                rationally encounter consequences that are extremely painful. Nor again is ' +
        'there anyone who loves or pursues or\n' +
        '               desires to obtain pain of itself, because it is pain, but because occasionally ' +
        'circumstances occur in which\n' +
        '                toil and pain can procure him some great pleasure.',
    date: '28.10.2021',
    geo: 'Измайлово',

};

export default class EventEditFormModel {
    editEvent(event: EventData) {
        console.log(event);
        void fetchPost(ApiUrls.Events + '/' + event.id, event, (data: FetchResponseData) => {
            const {status, json} = data;
            console.log(data);
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.RouteUrl, UrlPathnames.Event + '?id=' + json.body.id);
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
                        const ev: EventData = {
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
