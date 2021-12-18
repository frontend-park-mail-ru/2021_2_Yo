import { ApiStatus, ApiPostLoginData, ApiUrls, FetchResponseData, ApiErrors } from '@/types';
import { fetchPost } from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

export default class LoginModel {
    login(inputsData: Map<string, { errors: string[], value: string }>) {
        const postData: ApiPostLoginData = {
            email: <string>inputsData.get('email')?.value,
            password: <string>inputsData.get('password')?.value,
        };

        fetchPost(ApiUrls.Login, postData, (data: FetchResponseData) => {
            const { status, json, headers } = data;
            const token = headers?.get('X-CSRF-Token');

            if (status === ApiStatus.Ok)
                switch (json.status) {
                case ApiStatus.Ok:
                    if (token) {
                        Bus.emit(Events.CSRFRes, token);
                    }
                    Bus.emit(Events.RouteBack);
                    break;
                case ApiStatus.UserNotFound:
                    Bus.emit(Events.AuthError, ApiErrors['404']);
                    break;
                case ApiStatus.Internal:
                    Bus.emit(Events.AuthError, ApiErrors['500']);
                    break;
                }
        });
    }
}
