import {ApiPostLoginData, ApiUrls, FetchResponseData} from '../../../types.js';
import {fetchPost} from '../../../modules/request/request.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class LoginModel {
    login(inputsData: Map<string, { errors: string[], value: string }>) {
        const postData: ApiPostLoginData = {
            email: inputsData.get('email')?.value as string,
            password: inputsData.get('password')?.value as string,
        };

        void fetchPost(ApiUrls.Login, postData, (data: FetchResponseData) => {
            const {status, json, headers} = data;

            if (status === 200) {
                if (json.status === 200) {
                    console.log(headers);
                    if (headers?.get('X-Csrf-Token')) {
                        const token = document.cookie.match('csrf-token')
                        Bus.emit(Events.CSRFRes, token);
                        Bus.emit(Events.RouteBack);
                        return;
                    }
                }
            }
            Bus.emit(Events.AuthError, json.message);
        });
    }
}
