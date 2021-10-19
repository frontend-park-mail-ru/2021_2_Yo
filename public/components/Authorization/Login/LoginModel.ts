import {ApiPostLoginData} from '../../../types.js';
import {postLogin} from '../../../modules/request/request.js';
import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class LoginModel {
    async login(inputsData: Map<string, { errors: string[], value: string }>) {
        const postData: ApiPostLoginData = {
            email: inputsData.get('email')?.value as string,
            password: inputsData.get('password')?.value as string,
        };

        const error = await postLogin(postData);

        if (error) {
            bus.emit(Events.AuthError, error);
        } else {
            bus.emit(Events.UserLogin, null);
        }
    }
}
