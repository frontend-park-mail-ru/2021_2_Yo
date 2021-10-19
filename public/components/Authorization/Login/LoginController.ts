import bus, {Events} from '../../../modules/eventbus.js';
import {authValidateFields} from '../../../modules/validation.js';
import {InputErrors} from '../../../types.js';
import LoginView from './LoginView.js';
import LoginModel from './LoginModel.js';

export default class LoginController {
    #view: LoginView;
    #model: LoginModel;

    constructor() {
        bus.on(Events.SubmitLogin, this.#makeValidation.bind(this));
        this.#view = new LoginView(document.getElementById('App') as HTMLElement);
        this.#view.render();
        this.#model = new LoginModel();
    }

    #makeValidation = (inputs: Map<string, InputErrors>): void => {
        authValidateFields(inputs);

        let valid = true;
        inputs.forEach((item) => {
            item.errors.forEach(error => {
                if (error) {
                    valid = false;
                }
            })
        });

        if (valid) {
            this.#model.login(inputs);
        }
    }
}
