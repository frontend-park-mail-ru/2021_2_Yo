import {ApiPostSignupData, ApiUrls, FetchResponseData, UrlPathnames} from '../../../types.js';
import {fetchPost} from '../../../modules/request/request.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class SignupModel {
    signup(inputsData: Map<string, { errors: string[], value: string }>) {
        const postData: ApiPostSignupData = {
            name: inputsData.get('name')?.value as string,
            surname: inputsData.get('surname')?.value as string,
            email: inputsData.get('email')?.value as string,
            password: inputsData.get('password1')?.value as string
        };

        void fetchPost(ApiUrls.Signup, postData, (data: FetchResponseData) => {
            const {status, json, headers} = data;
            if (status === 200) {
                if (json.status === 200) {
                    if (headers?.get('X-Csrf-Token')) {
                        Bus.emit(Events.CSRFRes, headers?.get('X-Csrf-Token'));
                        Bus.emit(Events.RouteBack);
                        return;
                    }
                }
            }
            Bus.emit(Events.AuthError, json.message);
        });
    }
}
