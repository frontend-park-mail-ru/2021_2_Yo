import {ApiPostLoginData, InputErrors} from '../../../types.js';
import {postLogin} from '../../../modules/request/request.js';
import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class LoginModel {
    async login(inputs: Map<string, InputErrors>) {
        const postData: ApiPostLoginData = {
            email: inputs.get('email')?.value as string,
            password: inputs.get('password')?.value as string,
        };

        const error = await postLogin(postData);

        if (error) {
            bus.emit(Events.AuthError, error);
        } else {
            bus.emit(Events.UserLogin, null);
        }
    }
}
