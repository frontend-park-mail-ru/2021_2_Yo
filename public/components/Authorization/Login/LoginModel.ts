import {ApiPostLoginData, InputErrors} from '../../../types.js';
import {postLogin} from '../../../modules/request.js';
import bus, {Events} from '../../../modules/eventbus.js';

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
            bus.emit(Events.UserLogin, null)
        }
    }
}
