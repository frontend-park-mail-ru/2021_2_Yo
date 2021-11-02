import {EventData, UserData} from '@/types';
import ProfileEditForm from '@profile-page/ProfileEditForm/ProfileEditForm';
import UserStore from '@modules/userstore';
import * as template from '@profile-page/profilepage.hbs';
import * as blockTemplate from '@profile-page/profileblock.hbs';
import * as listTemplate from '@templates/eventlist/eventlist.hbs';
import '@templates/eventlist/eventlist.css';
import '@profile-page/Profile.css';

export default class ProfilePageView {
    #parent: HTMLElement;
    #editForm?: ProfileEditForm;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    #addListeners() {
        const editButton = document.getElementById('editButton') as HTMLElement;
        if (editButton) {
            editButton.addEventListener('click', this.#editHandle);
        }
    }

    #removeListeners() {
        const editButton = document.getElementById('editButton') as HTMLElement;
        if (editButton) {
            editButton.removeEventListener('click', this.#editHandle);
        }
    }

    #editHandle = ((ev: Event) => {
        ev.preventDefault();

        const bottomBlock = document.getElementById('bottomBlock') as HTMLElement;
        this.#editForm = new ProfileEditForm(bottomBlock);

        const editButton = document.getElementById('editButton') as HTMLElement;
        editButton.classList.add('button_none');

        this.#editForm.subscribe();
        this.#editForm.render(UserStore.get());
    });

    render() {
        this.#parent.innerHTML = template();
    }

    renderProfileBlock(user?: UserData) {
        const profileBlock = document.getElementById('profileBlock') as HTMLElement;

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
