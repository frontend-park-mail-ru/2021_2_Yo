import { ApiPostLoginData, ApiUrls, FetchResponseData } from '@/types';
import { fetchPost } from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

export default class LoginModel {
    login(inputsData: Map<string, { errors: string[], value: string }>) {
        const postData: ApiPostLoginData = {
            email: inputsData.get('email')?.value as string,
            password: inputsData.get('password')?.value as string,
        };

        fetchPost(ApiUrls.Login, postData, (data: FetchResponseData) => {
            const {status, json, headers} = data;

            if (status === 200) {
                if (json.status === 200) {
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
