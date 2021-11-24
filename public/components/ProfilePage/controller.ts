import ProfilePageView from '@profile-page/view';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import {passwordEditValidateFields, userEditValidateFields} from '@modules/validation';
import ProfilePageModel from '@profile-page/model';
import {EventData, UserData} from '@/types';
import UserStore from '@modules/userstore';

type MultipartData = {
    input: Map<string, { errors: string[], value: string }>,
    file?: File,
};

export default class ProfilePageController {
    #view: ProfilePageView;
    #model: ProfilePageModel;

    constructor(parent: HTMLElement) {
        this.#view = new ProfilePageView(parent);
        this.#model = new ProfilePageModel();
    }

    enable() {
        const userURLId = <string>new URL(window.location.href).searchParams?.get('id');

        Bus.on(Events.UserEditReq, this.#editReqHandle);
        Bus.on(Events.UserPasswordEditReq, this.#passwordEditHandle);
        Bus.on(Events.UserByIdRes, this.#userGetHandle);
        Bus.on(Events.UserLogout, this.#userErrorRenderHandle);
        Bus.on(Events.EventsRes, this.#eventListHandle);
        Bus.on(Events.EventsResFav, this.#eventListHandle);
        Bus.on(Events.SubscriptionsRes, this.#userListHandle.bind(this));
        Bus.on(Events.SubscribersRes, this.#userListHandle.bind(this));
        Bus.on(Events.UserRes, this.#renderHandle);
        Bus.on(Events.UserError, this.#userErrorRenderHandle);
        Bus.on(Events.EventsReq, this.#model.getUserEventsCreated.bind(this, userURLId));
        Bus.on(Events.EventsReqFav, this.#model.getUserEventsFavourite.bind(this, userURLId));
        Bus.on(Events.SubscriptionsReq, this.#model.getSubscriptions.bind(this, userURLId));
        Bus.on(Events.SubscribersReq, this.#model.getSubscribers.bind(this, userURLId));
        Bus.on(Events.SubscribeReq, this.#model.makeSubscription.bind(this, userURLId));
        Bus.on(Events.UnsubscribeReq, this.#model.unsubscribe.bind(this, userURLId));
        Bus.on(Events.UserIsSubscribed, this.#handleIsSubscribed);
        Bus.on(Events.SubscribeRes, this.#handleIsSubscribed);
        Bus.on(Events.UnsubscribeRes, this.#handleIsSubscribed);

        const storedUser = UserStore.get();
        if (storedUser) {
            const userURLId = new URL(window.location.href).searchParams?.get('id') as string;
            if (storedUser.id === userURLId) {
                this.#view.render();
                this.#view.renderProfileBlock(storedUser);
                this.#model.getUserEventsCreated(storedUser.id);
                this.#model.getIsSubscribed(storedUser.id);
            } else {
                this.#model.getUser(userURLId);
            }
        }
    }

    #eventListHandle = ((events: EventData[]) => {
        this.#view.renderEventList(events);
    }).bind(this);

    #userListHandle(users: UserData[]) {
        this.#view.renderUsersList(users);
    }

    #handleIsSubscribed(isSubscribed: boolean) {
        this.#view.renderSubscribeBlock(isSubscribed);
    }

    #userErrorRenderHandle = (() => {
        const userURLId = new URL(window.location.href).searchParams?.get('id') as string;
        this.#model.getUser(userURLId);
    }).bind(this);

    #renderHandle = (() => {
        const userURLId = new URL(window.location.href).searchParams?.get('id') as string;
        const user = UserStore.get();
        if (user?.id === userURLId) {
            Bus.emit(Events.UserByIdRes, user);
        } else {
            this.#model.getUser(userURLId);
        }
    }).bind(this);

    #userGetHandle = ((user: UserData) => {
        this.#view.render();
        this.#view.renderProfileBlock(user);
        this.#model.getUserEventsCreated(user.id);
        this.#model.getIsSubscribed(user.id);
    });

    #editReqHandle = ((data: MultipartData) => {
        userEditValidateFields(data['input'], data['file']);

        let valid = true;

        data['input'].forEach((item) => {
            item.errors.forEach(error => {
                if (error) {
                    valid = false;
                }
            });
        });

        if (valid) {
            Bus.emit(Events.ValidationOk);
            this.#model.editUser(data);
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
        const userURLId = <string>new URL(window.location.href).searchParams?.get('id');

        Bus.off(Events.UserEditReq, this.#editReqHandle);
        Bus.off(Events.UserPasswordEditReq, this.#passwordEditHandle);
        Bus.off(Events.UserByIdRes, this.#userGetHandle);
        Bus.off(Events.UserLogout, this.#userErrorRenderHandle);
        Bus.off(Events.EventsRes, this.#eventListHandle);
        Bus.off(Events.EventsResFav, this.#eventListHandle);
        Bus.off(Events.SubscriptionsRes, this.#userListHandle.bind(this));
        Bus.off(Events.SubscribersRes, this.#userListHandle.bind(this));
        Bus.off(Events.UserRes, this.#renderHandle);
        Bus.off(Events.UserError, this.#userErrorRenderHandle);
        Bus.off(Events.EventsReq, this.#model.getUserEventsCreated.bind(this, userURLId));
        Bus.off(Events.EventsReqFav, this.#model.getUserEventsFavourite.bind(this, userURLId));
        Bus.off(Events.SubscriptionsReq, this.#model.getSubscriptions.bind(this, userURLId));
        Bus.off(Events.SubscribersReq, this.#model.getSubscribers.bind(this, userURLId));
        Bus.off(Events.SubscribeReq, this.#model.makeSubscription.bind(this, userURLId));
        Bus.off(Events.UnsubscribeReq, this.#model.unsubscribe.bind(this, userURLId));
        Bus.off(Events.UserIsSubscribed, this.#handleIsSubscribed);
        Bus.off(Events.SubscribeRes, this.#handleIsSubscribed);
        Bus.off(Events.UnsubscribeRes, this.#handleIsSubscribed);

        this.#view.disable();
    }
}
