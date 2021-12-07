import { ApiStatus, ApiPostLoginData, ApiUrls, FetchResponseData } from '@/types';
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
            const {status, json, headers} = data;

            if (status === ApiStatus.Ok) {
                if (json.status === ApiStatus.Ok) {
                    const token = headers?.get('X-CSRF-Token');
                    if (token) {
                        Bus.emit(Events.CSRFRes, token);
                    }
                    Bus.emit(Events.RouteBack);
                    return;
                }
            }
            Bus.emit(Events.AuthError, json.message);
        });
    }
}
