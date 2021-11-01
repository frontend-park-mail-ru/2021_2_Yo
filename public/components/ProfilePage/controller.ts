import ProfilePageView from './view.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import {passwordEditValidateFields, userEditValidateFields} from '../../modules/validation.js';
import ProfilePageModel from './model.js';
import {UserData} from '../../types.js';
import UserStore from '../../modules/userstore.js';

export default class ProfilePageController {
    #view: ProfilePageView;
    #model: ProfilePageModel;

    constructor(parent: HTMLElement) {
        this.#view = new ProfilePageView(parent);
        this.#model = new ProfilePageModel();
    }

    enable() {
        Bus.on(Events.UserEditReq, this.#editReqHandle);
        Bus.on(Events.UserEditRes, this.#editResHandle);
        Bus.on(Events.UserPasswordEditReq, this.#passwordEditHandle);
        Bus.on(Events.UserByIdRes, this.#userGetHandle);

        const storedUser = UserStore.get();
        if (storedUser) {
            const userURLId = new URL(window.location.href).searchParams?.get('id') as string;
            if (storedUser.id === userURLId) {
                this.#view.render(storedUser);
            } else {
                this.#model.getUser(userURLId);
            }
        } else {
            Bus.on(Events.UserRes, this.#renderHandle);
            Bus.on(Events.UserError, this.#errorHandle);
        }
    }

    #editResHandle = ((user: UserData) => {
        this.#view.disableProfileForm();
        this.#view.renderProfileBlock(user);
    }).bind(this);

    #errorHandle = (() => {
        const userId = new URL(window.location.href).searchParams?.get('id') as string;
        this.#model.getUser(userId);
    }).bind(this);

    #renderHandle = (() => {
        const userId = new URL(window.location.href).searchParams?.get('id') as string;
        const user = UserStore.get();
        if (user?.id === userId) {
            Bus.emit(Events.UserByIdRes, user);
        }
    }).bind(this);

    #userGetHandle = ((user: UserData) => {
        this.#view.render(user);
    });

    #editReqHandle = ((inputsData: Map<string, { errors: string[], value: string }>) => {
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
            Bus.emit(Events.ValidationOk);
            this.#model.editUser(inputsData);
        } else {
            Bus.emit(Events.ValidationError);
        }
    });

    #passwordEditHandle = ((inputsData: Map<string, { errors: string[], value: string }>) => {
        passwordEditValidateFields(inputsData);

        let valid = true;

        inputsData.forEach((item) => {
            item.errors.forEach(error => {
                if (error) {
                    valid = false;
                }
            });
        });

        if (valid) {
            Bus.emit(Events.ValidationOk);
            this.#model.editPassword(inputsData.get('password1')?.value as string);
        } else {
            Bus.emit(Events.ValidationError);
        }
    });

    disable() {
        this.#view.disable();
    }
}
