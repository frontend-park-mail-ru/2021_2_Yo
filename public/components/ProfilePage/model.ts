import {ApiUrls, FetchResponseData, UserData} from '../../types.js';
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
            description: inputsData.get('description')?.value as string,
            password: inputsData.get('password1')?.value as string,
            id: new URL(window.location.href).searchParams?.get('id') as string
        };

        const stored = UserStore.get();
        for (const key of Object.keys(newUserInfo)) {
            if ((newUserInfo as any)[key]) {
                (stored as any)[key] = (newUserInfo as any)[key];
            }
        }
        console.log('Исправленный', stored);
        void fetchPost(ApiUrls.User + '/' + newUserInfo.id + '/info', stored, (data: FetchResponseData) => {
            const {status, json} = data;
            console.log(data);
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.UserEditRes);
                    return;
                }
            }
        });
    }

    editPassword(password: string) {
        const id = new URL(window.location.href).searchParams?.get('id') as string;
        void fetchPost(ApiUrls.User + '/' + id + '/password', {password}, (data: FetchResponseData) => {
            const {status, json} = data;
            console.log(data);
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.UserEditRes);
                    return;
                }
            }
        });
    }
}
