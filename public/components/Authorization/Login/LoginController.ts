import bus, {Events} from '../../../modules/eventbus.js';
import {authValidateFields} from "../../../modules/validation.js";
import {InputErrors} from "../../../types.js";
import LoginView from "./LoginView.js";
import LoginModel from "./LoginModel.js";

export default class LoginController {
    #view: LoginView;
    #model: LoginModel;

    constructor() {
        bus.on(Events.SubmitLogin, this.#makeValidation);
        this.#view = new LoginView(document.getElementById('App') as HTMLElement);
        this.#view.render();
        this.#model = new LoginModel();
    }

    #makeValidation = (args: { inputs: Map<string, InputErrors> }): void => {
        alert(args);
        authValidateFields(args.inputs);

        let valid = true;
        args.inputs.forEach((item) => {
            item.errors.forEach(error => {
                if (error) {
                    valid = false;
                }
            })
        });

        if (valid) {
            this.#model.login(args.inputs);
        }
    }
}