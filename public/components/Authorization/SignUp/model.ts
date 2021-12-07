import { ApiStatus, ApiPostSignupData, ApiUrls, FetchResponseData, UrlPathnames } from '@/types';
import { fetchPost } from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

export default class SignupModel {
    signup(inputsData: Map<string, { errors: string[], value: string }>) {
        const postData: ApiPostSignupData = {
            name: <string>inputsData.get('name')?.value,
            surname: <string>inputsData.get('surname')?.value,
            email: <string>inputsData.get('email')?.value,
            password: <string>inputsData.get('password1')?.value,
        };

        fetchPost(ApiUrls.Signup, postData, (data: FetchResponseData) => {
            const { status, json, headers } = data;
            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const token = headers?.get('X-CSRF-Token');
                    if (token) {
                        Bus.emit(Events.CSRFRes, token);
                    }
                    Bus.emit(Events.RouteUrl, UrlPathnames.Main);
                    return;
                }
            }
            Bus.emit(Events.AuthError, json.message);
        });
    }
}
