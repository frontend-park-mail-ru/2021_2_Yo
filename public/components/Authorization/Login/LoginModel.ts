import {ApiPostLoginData, ApiUrls, FetchResponseData} from '../../../types.js';
import {fetchPost} from '../../../modules/request/request.js';
import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class LoginModel {
    login(inputsData: Map<string, { errors: string[], value: string }>) {
        const postData: ApiPostLoginData = {
            email: inputsData.get('email')?.value as string,
            password: inputsData.get('password')?.value as string,
        };

        void fetchPost(ApiUrls.Login, postData, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    bus.emit(Events.UserAuthorized, null);
                }
            }
            bus.emit(Events.AuthError, json.message);
        });
    }
}
