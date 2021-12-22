import ProfilePageView from '@profile-page/view';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { passwordEditValidateFields, userEditValidateFields } from '@modules/validation';
import ProfilePageModel from '@profile-page/model';
import { EventData, UrlPathnames, UserData } from '@/types';
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
        Bus.on(Events.EventsReq, this.#createdEventsRequestHandle);
        Bus.on(Events.EventsReqFav, this.#favouriteEventsRequestHandle);
        Bus.on(Events.SubscriptionsReq, this.#subscriptionsHandle);
        Bus.on(Events.SubscribersReq, this.#subscribersHandle);

        Bus.on(Events.SubscribeReq, this.#subscribeHandle);
        Bus.on(Events.UnsubscribeReq, this.#unsubscribeHandle);
        Bus.on(Events.UserIsSubscribedReq, this.#isSubscribedHandle);
        Bus.on(Events.UserIsSubscribedRes, this.#handleIsSubscribed.bind(this));
        Bus.on(Events.SubscribeRes, this.#isSubscribedHandle);
        Bus.on(Events.UnsubscribeRes, this.#isSubscribedHandle);

        const storedUser = UserStore.get();
        if (storedUser) {
            const userURLId = <string>new URL(window.location.href).searchParams?.get('id');
            if (storedUser.id === userURLId) {
                this.#view.render(storedUser);
            } else {
                this.#model.getUser(userURLId);
            }
        } else {
            this.#model.getUser(userURLId);
        }
    }

    #eventListHandle = ((events: EventData[]) => {
        this.#view.renderEventList(events);
    });

    #isSubscribedHandle = ((id: string) => {
        this.#model.getIsSubscribed(id);
    });

    #userListHandle(users: UserData[]) {
        this.#view.renderUsersList(users);
    }

    #handleIsSubscribed(isSubscribed: boolean) {
        this.#view.renderSubscribeButton(isSubscribed);
    }

    #subscribeHandle = ((id: string) => {
        if (!UserStore.get())
            Bus.emit(Events.RouteUrl, UrlPathnames.Login);
        this.#model.makeSubscription(id);
    });

    #unsubscribeHandle = ((id: string) => {
        this.#model.unsubscribe(id);
    });

    #createdEventsRequestHandle = ((id: string) => {
        this.#model.getUserEventsCreated(id);
    });

    #favouriteEventsRequestHandle = ((id: string) => {
        this.#model.getUserEventsFavourite(id);
    });

    #subscriptionsHandle = ((id: string) => {
        this.#model.getSubscriptions(id);
    });

    #subscribersHandle = ((id: string) => {
        this.#model.getSubscribers(id);
    });

    #userErrorRenderHandle = () => {
        const userURLId = <string>new URL(window.location.href).searchParams?.get('id');
        this.#model.getUser(userURLId);
    };

    #renderHandle = () => {
        this.#view.disableProfileForm();
        const userURLId = <string>new URL(window.location.href).searchParams?.get('id');
        const user = UserStore.get();
        if (user?.id === userURLId) {
            Bus.emit(Events.UserByIdRes, user);
        } else {
            this.#model.getUser(userURLId);
        }
    };

    #userGetHandle = ((user: UserData) => {
        this.#view.render(user);
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
            this.#model.editPassword(<string>inputsData.get('password1')?.value);
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
        Bus.off(Events.EventsReq, this.#createdEventsRequestHandle);
        Bus.off(Events.EventsReqFav, this.#favouriteEventsRequestHandle);
        Bus.off(Events.SubscriptionsReq, this.#subscriptionsHandle);
        Bus.off(Events.SubscribersReq, this.#subscribersHandle);
        Bus.off(Events.SubscribeReq, this.#subscribeHandle);
        Bus.off(Events.UnsubscribeReq, this.#unsubscribeHandle);
        Bus.off(Events.UserIsSubscribedReq, this.#isSubscribedHandle);
        Bus.off(Events.UserIsSubscribedRes, this.#handleIsSubscribed.bind(this));
        Bus.off(Events.SubscribeRes, this.#isSubscribedHandle);
        Bus.off(Events.UnsubscribeRes, this.#isSubscribedHandle);

        this.#view.disable();
    }
}
