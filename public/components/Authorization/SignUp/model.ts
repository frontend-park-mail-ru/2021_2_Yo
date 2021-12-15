import { ApiStatus, ApiPostSignupData, ApiUrls, FetchResponseData, UrlPathnames, ApiErrors } from '@/types';
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
            const token = headers?.get('X-CSRF-Token');

            if (status === ApiStatus.Ok) {
                switch (json.status) {
                case ApiStatus.Ok:
                    if (token) {
                        Bus.emit(Events.CSRFRes, token);
                    }
                    Bus.emit(Events.RouteUrl, UrlPathnames.Main);
                    break;
                case ApiStatus.Internal:
                    Bus.emit(Events.AuthError, ApiErrors['500']);
                    break;
                case ApiStatus.UserAlreadyExists:
                    Bus.emit(Events.AuthError, ApiErrors['409']);
                    break;

                }
            }
        });
    }
}
