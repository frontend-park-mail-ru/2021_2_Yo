import {ApiUrls, FetchResponseData, UserData} from '../../types.js';
import {fetchGet, fetchPost} from '../../modules/request/request.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import UserStore from '../../modules/userstore.js';

export default class ProfilePageModel {
    getUser(userId: string) {
        let user: UserData;
        if (UserStore.get()?.id === userId) {
            user = UserStore.get() as UserData;
        } else {
            void fetchGet(ApiUrls.User + '/' + userId, (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        user = json.body as UserData;
                    }
                }
            });
        }
        Bus.emit(Events.UserRes, user!);
    }

    editUser(inputsData: Map<string, { errors: string[], value: string }>) {
        const user = {
            name: inputsData.get('name')?.value as string,
            surname: inputsData.get('surname')?.value as string,
            description: inputsData.get('description')?.value as string,
            password: inputsData.get('password1')?.value as string,
            id: new URL(window.location.href).searchParams?.get('id') as string
        };

        void fetchPost(ApiUrls.User + '/' + user.id, user, (data: FetchResponseData) => {
            const {status, json} = data;
            console.log(data);
            if (status === 200) {
                if (json.status === 200) {
                    Bus.emit(Events.UserReq);
                    Bus.emit(Events.UserEditRes);
                    return;
                }
            }
        });
    }
}
