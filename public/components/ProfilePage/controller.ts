import ProfilePageView from './view.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import {passwordEditValidateFields, userEditValidateFields} from '../../modules/validation.js';
import ProfilePageModel from './model.js';
import {EventData, UserData} from '../../types.js';
import UserStore from '../../modules/userstore.js';

export default class ProfilePageController {
    #view: ProfilePageView;
    #model: ProfilePageModel;
    #userResSubscribe: boolean;

    constructor(parent: HTMLElement) {
        this.#view = new ProfilePageView(parent);
        this.#model = new ProfilePageModel();
        this.#userResSubscribe = false;
    }

    enable() {
        Bus.on(Events.UserEditReq, this.#editReqHandle);
        Bus.on(Events.UserEditRes, this.#editResHandle);
        Bus.on(Events.UserPasswordEditReq, this.#passwordEditHandle);
        Bus.on(Events.UserByIdRes, this.#userGetHandle);
        Bus.on(Events.UserLogout, this.#userErrorRenderHandle);
        Bus.on(Events.EventsRes, this.#listHandle);

        const storedUser = UserStore.get();
        if (storedUser) {
            const userURLId = new URL(window.location.href).searchParams?.get('id') as string;
            if (storedUser.id === userURLId) {
                this.#view.render(storedUser);
                this.#view.renderProfileBlock(storedUser);
                this.#model.getUserEvents(storedUser.id);
            } else {
                this.#model.getUserEvents(userURLId);
                this.#model.getUser(userURLId);
            }
        } else {
            this.#userResSubscribe = true;
            Bus.on(Events.UserRes, this.#renderHandle);
            Bus.on(Events.UserError, this.#userErrorRenderHandle);
        }
    }

    #listHandle = ((events: EventData[]) => {
        this.#view.renderEventList(events);
    }).bind(this);

    #editResHandle = ((user: UserData) => {
        this.#view.disableProfileForm();
        this.#view.renderProfileBlock(user);
    }).bind(this);

    #userErrorRenderHandle = (() => {
        const userURLId = new URL(window.location.href).searchParams?.get('id') as string;
        this.#model.getUser(userURLId);
        this.#model.getUserEvents(userURLId);
    }).bind(this);

    #renderHandle = (() => {
        const userURLId = new URL(window.location.href).searchParams?.get('id') as string;
        const user = UserStore.get();
        if (user?.id === userURLId) {
            Bus.emit(Events.UserByIdRes, user);
        } else {
            this.#model.getUser(userURLId);
            this.#model.getUserEvents(userURLId);
        }
    }).bind(this);

    #userGetHandle = ((user: UserData) => {
        this.#view.render(user);
        this.#view.renderProfileBlock(user);
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
        Bus.off(Events.UserEditReq, this.#editReqHandle);
        Bus.off(Events.UserEditRes, this.#editResHandle);
        Bus.off(Events.UserPasswordEditReq, this.#passwordEditHandle);
        Bus.off(Events.UserByIdRes, this.#userGetHandle);
        Bus.off(Events.EventsRes, this.#listHandle);

        if (this.#userResSubscribe) {
            Bus.off(Events.UserRes, this.#renderHandle);
            Bus.off(Events.UserError, this.#userErrorRenderHandle);
        }
        this.#view.disable();
    }
}
