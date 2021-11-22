import {EventData, UserData} from '@/types';
import ProfileEditForm from '@profile-page/ProfileEditForm/ProfileEditForm';
import UserStore from '@modules/userstore';
import * as template from '@profile-page/templates/profilepage.hbs';
import * as blockTemplate from '@profile-page/templates/profileblock.hbs';
import * as listTemplate from '@templates/eventlist/eventlist.hbs';
import '@templates/eventlist/eventlist.css';
import Bus from '@eventbus/eventbus';
import '@profile-page/templates/Profile.css';
import Events from '@eventbus/events';

export default class ProfilePageView {
    #parent: HTMLElement;
    #editForm?: ProfileEditForm;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    #addListeners() {
        const editButton = <HTMLElement>document.getElementById('editButton');
        if (editButton) {
            editButton.addEventListener('click', this.#editHandle);
        }

        const createdButton = document.getElementById('createdButton');
        if (createdButton) {
            createdButton.addEventListener('click', () => Bus.emit(Events.EventsReq));
        }

        const favouriteButton = document.getElementById('favouriteButton');
        if (favouriteButton) {
            favouriteButton.addEventListener('click', () => Bus.emit(Events.EventsReqFav));
        }

        const subscriptionsButton = document.getElementById('subscriptionsButton');
        if (subscriptionsButton) {
            subscriptionsButton.addEventListener('click', () => Bus.emit(Events.SubscriptionsReq));
        }

        const subscribersButton = document.getElementById('subscribersButton');
        if (subscribersButton) {
            subscribersButton.addEventListener('click', () => Bus.emit(Events.SubscribersReq));
        }
    }

    #removeListeners() {
        const editButton = <HTMLElement>document.getElementById('editButton');
        if (editButton) {
            editButton.removeEventListener('click', this.#editHandle);
        }

        const createdButton = document.getElementById('createdButton');
        if (createdButton) {
            createdButton.removeEventListener('click', () => Bus.emit(Events.EventsReq));
        }

        const favouriteButton = document.getElementById('favouriteButton');
        if (favouriteButton) {
            favouriteButton.removeEventListener('click', () => Bus.emit(Events.EventsReqFav));
        }

        const subscriptionsButton = document.getElementById('subscriptionsButton');
        if (subscriptionsButton) {
            subscriptionsButton.removeEventListener('click', () => Bus.emit(Events.SubscriptionsReq));
        }

        const subscribersButton = document.getElementById('subscribersButton');
        if (subscribersButton) {
            subscribersButton.removeEventListener('click', () => Bus.emit(Events.SubscribersReq));
        }
    }

    #editHandle = ((ev: Event) => {
        ev.preventDefault();

        const bottomBlock = <HTMLElement>document.getElementById('bottomBlock');
        this.#editForm = new ProfileEditForm(bottomBlock);

        const editButton = <HTMLElement>document.getElementById('editButton');
        editButton.classList.add('button_none');

        this.#editForm.subscribe();
        this.#editForm.render(UserStore.get());
    });

    render() {
        this.#parent.innerHTML = template();
    }

    renderProfileBlock(user?: UserData) {
        const profileBlock = <HTMLElement>document.getElementById('profileBlock');

        const storedId = UserStore.get()?.id;
        const permitEdit = (user?.id == storedId);
        profileBlock.innerHTML = blockTemplate({user, permitEdit});

        this.#addListeners();
    }

    renderEventList(events?: EventData[]) {
        const listBlock = <HTMLElement>document.getElementById('listBlock');

        listBlock.innerHTML = listTemplate({events: events});
    }

    disableProfileForm() {
        this.#editForm?.disable();
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
