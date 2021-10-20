import {ApiPostSignupData} from '../../../types.js';
import {postSignup} from '../../../modules/request/request.js';
import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class SignupModel {
    async signup(inputsData: Map<string, { errors: string[], value: string }>) {
        const postData: ApiPostSignupData = {
            name: inputsData.get('name')?.value as string,
            surname: inputsData.get('surname')?.value as string,
            email: inputsData.get('email')?.value as string,
            password: inputsData.get('password1')?.value as string
        };
        const error = await postSignup(postData);

        if (error) {
            bus.emit(Events.AuthError, error);
        } else {
            bus.emit(Events.UserAuthorized, null);
        }
    }
}