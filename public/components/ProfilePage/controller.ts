import ProfilePageView from './view.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import {userEditValidateFields} from '../../modules/validation.js';
import ProfilePageModel from './model.js';
import {UserData} from '../../types.js';

export default class ProfilePageController {
    #view: ProfilePageView;
    #model: ProfilePageModel;

    constructor(parent: HTMLElement) {
        this.#view = new ProfilePageView(parent);
        this.#model = new ProfilePageModel();
    }

    enable() {
        Bus.on(Events.UserEditReq, this.#userEditHandle);
        Bus.on(Events.UserRes, this.#userGetHandle);
        const userId = new URL(window.location.href).searchParams?.get('id') as string;
        this.#model.getUser(userId);
    }

    #userGetHandle = ((user: UserData) => {
        this.#view.render(user);
    });

    #userEditHandle = ((inputsData: Map<string, { errors: string[], value: string }>) => {
        userEditValidateFields(inputsData);

        let valid = true;

        inputsData.forEach((item) => {
            item.errors.forEach(error => {
                if (error) {
                    valid = false;
                }
            });
        });

        if (valid) {
            Bus.emit(Events.ValidationOk, null);
            this.#model.editUser(inputsData);
        } else {
            Bus.emit(Events.ValidationError, null);
        }
    });

    disable() {
        this.#view.disable();
    }
}
