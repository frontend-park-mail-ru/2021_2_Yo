import {EventData, UserData} from '@/types';
import ProfileEditForm from '@profile-page/ProfileEditForm/ProfileEditForm';
import UserStore from '@modules/userstore';
import * as template from '@profile-page/templates/profilepage.hbs';
import * as userList from '@profile-page/templates/userlist.hbs';
import * as listTemplate from '@templates/eventlisthorizontal/eventlist.hbs';
import '@templates/eventlisthorizontal/eventlist.css';
import Bus from '@eventbus/eventbus';
import '@profile-page/templates/Profile.css';
import Events from '@eventbus/events';

export default class ProfilePageView {
    #parent: HTMLElement;
    #editForm?: ProfileEditForm;
    #user?: UserData;

    #createdButton?: HTMLElement;
    #favouriteButton?: HTMLElement;
    #subscriptionsButton?: HTMLElement;
    #subscribersButton?: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    #addListeners() {
        const editButton = <HTMLElement>document.getElementById('editButton');
        if (editButton) {
            editButton.addEventListener('click', this.#editHandle.bind(this));
        }

        this.#createdButton = <HTMLElement>document.getElementById('createdButton');
        if (this.#createdButton) {
            this.#createdButton.addEventListener('click', this.#makeCreatedEventsRequest);
        }

        this.#favouriteButton = <HTMLElement>document.getElementById('favouriteButton');
        if (this.#favouriteButton) {
            this.#favouriteButton.addEventListener('click', this.#makeFavouriteEventsRequest);
        }

        this.#subscriptionsButton = <HTMLElement>document.getElementById('subscriptionsButton');
        if (this.#subscriptionsButton) {
            this.#subscriptionsButton.addEventListener('click', this.#makeSubscriptionsRequest);
        }

        this.#subscribersButton = <HTMLElement>document.getElementById('subscribersButton');
        if (this.#subscribersButton) {
            this.#subscribersButton.addEventListener('click', this.#makeSubscribersRequest);
        }

        const subscribeButton = document.getElementById('subscribeButton');
        if (subscribeButton) {
            subscribeButton.addEventListener('click', this.#makeSubscribeRequest);
        }

        const unsubscribeButton = document.getElementById('unsubscribeButton');
        if (unsubscribeButton) {
            unsubscribeButton.addEventListener('click', this.#makeUnsubscribeRequest);
        }

        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => Bus.emit(Events.RouteBack));
        }
    }

    #removeListeners() {
        const editButton = <HTMLElement>document.getElementById('editButton');
        if (editButton) {
            editButton.removeEventListener('click', this.#editHandle.bind(this));
        }

        if (this.#createdButton) {
            this.#createdButton.removeEventListener('click', this.#makeCreatedEventsRequest);
        }

        if (this.#favouriteButton) {
            this.#favouriteButton.removeEventListener('click', this.#makeFavouriteEventsRequest);
        }

        if (this.#subscriptionsButton) {
            this.#subscriptionsButton.removeEventListener('click', this.#makeSubscriptionsRequest);
        }

        if (this.#subscribersButton) {
            this.#subscribersButton.removeEventListener('click', this.#makeSubscribersRequest);
        }

        const subscribeButton = document.getElementById('subscribeButton');
        if (subscribeButton) {
            subscribeButton.removeEventListener('click', this.#makeSubscribeRequest);
        }

        const unsubscribeButton = document.getElementById('unsubscribeButton');
        if (unsubscribeButton) {
            unsubscribeButton.removeEventListener('click', this.#makeUnsubscribeRequest);
        }

        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.removeEventListener('click', () => Bus.emit(Events.RouteBack));
        }
    }

    #editHandle(ev: Event) {
        ev.preventDefault();

        const mainContent = <HTMLElement>document.getElementById('mainContent');
        this.#editForm = new ProfileEditForm(mainContent);

        this.#editForm.subscribe();
        this.#editForm.render(UserStore.get());
    }

    render(user?: UserData) {
        this.#user = user;

        const permission = (user?.id === UserStore.get()?.id);
        this.#parent.innerHTML = template({user, permission});

        this.#addListeners();

        Bus.emit(Events.UserIsSubscribedReq, this.#user?.id);
        this.#makeCreatedEventsRequest();
    }

    renderSubscribeButton(isSubscribed: boolean) {
        const subscribeButton = <HTMLElement>document.getElementById('subscribeButton');
        const unsubscribeButton = <HTMLElement>document.getElementById('unsubscribeButton');

        if (isSubscribed) {
            subscribeButton?.classList.add('profile-button-subscribe_none');
            unsubscribeButton?.classList.remove('profile-button-subscribe_none');
        } else {
            subscribeButton?.classList.remove('profile-button-subscribe_none');
            unsubscribeButton?.classList.add('profile-button-subscribe_none');
        }
    }

    #makeCreatedEventsRequest = (() => {
        this.#createdButton?.classList.add('menu__item_clicked');
        this.#favouriteButton?.classList.remove('menu__item_clicked');
        this.#subscribersButton?.classList.remove('menu__item_clicked');
        this.#subscriptionsButton?.classList.remove('menu__item_clicked');

        Bus.emit(Events.EventsReq, this.#user?.id);
    });

    #makeFavouriteEventsRequest = (() => {
        this.#createdButton?.classList.remove('menu__item_clicked');
        this.#favouriteButton?.classList.add('menu__item_clicked');
        this.#subscribersButton?.classList.remove('menu__item_clicked');
        this.#subscriptionsButton?.classList.remove('menu__item_clicked');

        Bus.emit(Events.EventsReqFav, this.#user?.id);
    });

    #makeSubscribersRequest = (() => {
        this.#createdButton?.classList.remove('menu__item_clicked');
        this.#favouriteButton?.classList.remove('menu__item_clicked');
        this.#subscribersButton?.classList.add('menu__item_clicked');
        this.#subscriptionsButton?.classList.remove('menu__item_clicked');

        Bus.emit(Events.SubscribersReq, this.#user?.id);
    });

    #makeSubscriptionsRequest = (() => {
        this.#createdButton?.classList.remove('menu__item_clicked');
        this.#favouriteButton?.classList.remove('menu__item_clicked');
        this.#subscribersButton?.classList.remove('menu__item_clicked');
        this.#subscriptionsButton?.classList.add('menu__item_clicked');

        Bus.emit(Events.SubscriptionsReq, this.#user?.id);
    });

    #makeSubscribeRequest = (() => {
        Bus.emit(Events.SubscribeReq, this.#user?.id);
    });

    #makeUnsubscribeRequest = (() => {
        Bus.emit(Events.UnsubscribeReq, this.#user?.id);
    });


    renderEventList(events?: EventData[]) {
        const listBlock = <HTMLElement>document.getElementById('listBlock');

        listBlock.innerHTML = listTemplate({events: events});
    }

    renderUsersList(users?: UserData[]) {
        const listBlock = <HTMLElement>document.getElementById('listBlock');

        listBlock.innerHTML = userList({users: users});
    }

    disableProfileForm() {
        this.#editForm?.disable();
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
