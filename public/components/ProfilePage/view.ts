import {UserData} from '../../types.js';
import ProfileEditForm from './ProfileEditForm/ProfileEditForm.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import UserStore from '../../modules/userstore.js';

export default class ProfilePageView {
    #parent: HTMLElement;
    #editForm?: ProfileEditForm;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    #addListeners() {
        Bus.on(Events.UserEditRes, this.#editResHandle);

        const editButton = document.getElementById('editButton') as HTMLElement;
        editButton.addEventListener('click', this.#editHandle);
    }

    #editResHandle = (() => {
        const stored = UserStore.get();
        // this.#renderProfileBlock(stored);
    }).bind(this);

    #removeListeners() {
        Bus.off(Events.UserEditRes, this.#editResHandle);

        const editButton = document.getElementById('editButton') as HTMLElement;
        editButton.removeEventListener('click', this.#editHandle);
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

    render(user?: UserData) {
        const source = `
          <div class="profile-background">
                <div class="profile-block" id="profileBlock">
                </div>
                <div class="list-block">
                    <div class="border-block">
                        <a class="rounded-button standard-text">Созданное</a>
                    </div>
                </div>
          </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template();

        this.#renderProfileBlock(user);

        this.#addListeners();
    }

    #renderProfileBlock(user?: UserData) {
        const source = `
            <div class="border-block">
                <div class="profile-block__header">
                    <div class="border-block__profile-avatar">
                        <img src="https://source.boringavatars.com/marble/32" class="profile-avatar">
                    </div>
                    <div class="border-block__name">
                        <p class="profile-name">{{user.name}}</p>
                        <p class="profile-name">{{user.surname}}</p>
                        <p class="profile-email">{{user.email}}</p>
                    </div>
                </div>
                <div class="profile-block__bottom" id="bottomBlock">
                {{#if user.description}}
                    <p class="standard-text">О себе</p>
                    <p class="description-text">{{user.description}}</p>
                {{/if}}
                </div>
            </div>
            {{#if permitEdit}}
            <button class="button-edit profile-block__button-edit" id="editButton">Редактировать профиль</button>
            {{/if}}
        `;

        const template = window.Handlebars.compile(source);
        const profileBlock = document.getElementById('profileBlock') as HTMLElement;

        const storedId = UserStore.get()?.id;
        console.log(UserStore.get());
        const permitEdit = (user?.id == storedId);
        profileBlock.innerHTML = template({user, permitEdit});
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
