import {ApiUrls, EventData, FetchResponseData, UserData} from '../../types.js';
import {fetchGet, fetchPost} from '../../modules/request/request.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import UserStore from '../../modules/userstore.js';

export default class ProfilePageModel {
    getUser(userId: string) {
        void fetchGet(ApiUrls.User + '/' + userId, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const user = json.body as UserData;
                    Bus.emit(Events.UserByIdRes, user);
                    return;
                }
            }
        });

    }

    editUser(inputsData: Map<string, { errors: string[], value: string }>) {
        const newUserInfo = {
            name: inputsData.get('name')?.value as string,
            surname: inputsData.get('surname')?.value as string,
            description: inputsData.get('selfDescription')?.value as string,
        };

        const stored = UserStore.get() as UserData;
        stored.name = newUserInfo.name;
        stored.surname = newUserInfo.surname;
        stored.description = newUserInfo.description;

        void fetchPost(ApiUrls.User + '/info', stored, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.UserEditRes, stored);
                    return;
                }
            }
        });
    }

    editPassword(password: string) {
        void fetchPost(ApiUrls.User + '/password', {password}, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const stored = UserStore.get() as UserData;
                    Bus.emit(Events.UserEditRes, stored);
                    return;
                }
            }
        });
    }

    getUserEvents(userId: string) {
        // void fetchGet(ApiUrls.Events + '?authorid=' + userId, (data: FetchResponseData) => {
        //     const {status, json} = data;
        //     if (status === 200) {
        //         if (json.status === 200) {
        //             const events = json.body as EventData[];
        //             Bus.emit(Events.EventsRes, events);
        //             return;
        //         }
        //     }
        // });
        const events: EventData[] = [{
            id: 1,
            authorid: '2',
            title: 'title',
            city: 'Moscow',
            geo: 'Moscow',
            category: 'Tusa',
            description: 'fjoewf',
            text: 'voejrvfperjv',
            date: 'f[ef',
            tag: [],
        }, {
            id: 2,
            authorid: '2',
            title: 'Title',
            city: 'Moscow',
            geo: 'Moscow',
            category: 'Tusa',
            description: 'fjoewf',
            text: 'voejrvfperjv',
            date: 'f[ef',
            tag: [],
        }];

        Bus.emit(Events.EventsRes, events);
    }
}
