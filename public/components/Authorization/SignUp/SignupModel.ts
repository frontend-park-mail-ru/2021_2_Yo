import {ApiPostSignupData, ApiUrls, FetchResponseData} from '../../../types.js';
import {fetchPost} from '../../../modules/request/request.js';
import bus from '../../../modules/eventbus/eventbus.js';
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
