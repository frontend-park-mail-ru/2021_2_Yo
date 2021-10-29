import Bus from "../../modules/eventbus/eventbus";
import Events from "../../modules/eventbus/events";
import {UrlPathnames, UserData} from "../../types";
import ProfileEditForm from './ProfileEditForm/ProfileEditForm.js';

export default class ProfilePageView {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    #addListeners() {
        const editButton = document.getElementById('editButton') as HTMLElement;
        editButton.addEventListener('click', this.#editHandle)
    }

    #removeListeners() {
        const editButton = document.getElementById('editButton') as HTMLElement;
        editButton.addEventListener('click', this.#editHandle)
    }

    #editHandle = ((ev: Event) => {
        ev.preventDefault()

        const bottomBlock = document.getElementById('bottomBlock') as HTMLElement;
        const editForm = new ProfileEditForm(bottomBlock);
        editForm.render();
    });

    render(user?: UserData) {
        const source = `
          <div class="profile-background">
                <div class="profile-block">
                    <div class="border-block">
                        <div block="profile-block__header">
                            <div class="border-block__profile-avatar">
                                <img src="https://source.boringavatars.com/marble/32" class="profile-avatar">
                            </div>
                            <div class="border-block__name">
                                <p class="profile-name">{{name}}</p>
                                <p class="profile-name">{{surname}}</p>
                                <p class="profile-email">{{email}}</p>
                            </div>
                        </div>
                        <div class="profile-block__bottom" id="bottomBlock">
                            <p class="standard-text">О себе</p>
                            <p class="description-text">{{description}}</p>
                        </div>
                    </div>
                    <a class="button-edit left-block__button-edit" id="editButton">Редактировать профиль</a>
                </div>
                <div class="list-block">
                    <div class="border-block">
                        <a class="rounded-button standard-text">Созданное</a>
                    </div>
                </div>
          </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template(user);

        this.#addListeners();
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}