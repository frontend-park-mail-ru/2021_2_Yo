import { ApiPostLoginData, ApiUrls, FetchResponseData, UrlPathnames } from '../../../types';
import { fetchPost } from '../../../modules/request/request';
import Bus from '../../../modules/eventbus/eventbus';
import Events from '../../../modules/eventbus/events';

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
                    // bus.emit(Events.UserAuthorized, null);
                    Bus.emit(Events.RouteUrl, UrlPathnames.Main);
                    return;
                }
            }
            Bus.emit(Events.AuthError, json.message);
        });
    }
}
