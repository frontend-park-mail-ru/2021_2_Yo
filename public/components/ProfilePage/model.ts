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
        };

        const stored = UserStore.get() as UserData;
        stored.name = newUserInfo.name;
        stored.surname = newUserInfo.surname;
        stored.description = newUserInfo.description;

        console.log(stored, newUserInfo);
        void fetchPost(ApiUrls.User + '/info', stored, (data: FetchResponseData) => {
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
        void fetchPost(ApiUrls.User + '/password', {password}, (data: FetchResponseData) => {
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
