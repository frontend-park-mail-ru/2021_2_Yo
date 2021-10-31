import {ApiUrls, FetchResponseData, UserData} from '../../types.js';
import {fetchGet, fetchPost} from '../../modules/request/request.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import UserStore from '../../modules/userstore.js';

export default class ProfilePageModel {
    getUser(userId: string) {
        // let user = UserStore.get() as UserData;
        console.log(userId);
        let user = {id: '1', name: 'Ksenia', surname: 'Nikitina'};
        if (user.id === userId) {
            Bus.emit(Events.UserByIdRes, user);
        } else {
            void fetchGet(ApiUrls.User + '/' + userId, (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        user = json.body as UserData;
                        Bus.emit(Events.UserByIdRes, user);
                        return;
                    }
                }
            });
        }
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
        console.log(stored, newUserInfo);
        for (const key of Object.keys(newUserInfo)) {
            if ((newUserInfo as any)[key]) {
                (stored as any)[key] = (newUserInfo as any)[key];
            }
        }
        console.log(UserStore.get());
        void fetchPost(ApiUrls.User + '/' + newUserInfo.id + '/info', newUserInfo, (data: FetchResponseData) => {
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
