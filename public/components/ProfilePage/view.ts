import {EventData, UserData} from '../../types.js';
import ProfileEditForm from './ProfileEditForm/ProfileEditForm.js';
import UserStore from '../../modules/userstore.js';

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

    render(user?: UserData) {
        const source = `
          <div class="profile-background">
                <div class="profile-block" id="profileBlock">
                </div>
                <div class="list-block" id="listBlock">
                </div>
          </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template();
    }

    renderProfileBlock(user?: UserData) {
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
            <a class="button-edit profile-block__button-edit" href="/create">Cоздать мероприятие</a>
            {{/if}}
        `;

        const template = window.Handlebars.compile(source);
        const profileBlock = document.getElementById('profileBlock') as HTMLElement;

        const storedId = UserStore.get()?.id;
        const permitEdit = (user?.id == storedId);
        profileBlock.innerHTML = template({user, permitEdit});

        this.#addListeners();
    }

    renderEventList(events?: EventData[]) {
        const listBlock = <HTMLElement>document.getElementById('listBlock');
        const list = `
            <div class="border-block">
                <a class="rounded-button standard-text">Созданное</a>
            </div>
            {{#if events}}
                <div id="events-list">
                {{#each events}}
                    <div class="event-li">
                        <div class="event-li__img bg-img-wrapper">
                            <img class="bg-img" src="{{imgUrl}}">
                        </div>
                        <div class ="event-li__content">
                            <a class="event-li__title" href="/events?id={{id}}">{{title}}</a>
                            <div class="event-li__description">{{description}}</div>
                            <div class="event-li__info event-li__description">
                                <div class="event-li__description">
                                    <span>Когда:&nbsp;</span>
                                    <span class="text_date">{{date}}</span>
                                    <span>Где:&nbsp;</span>
                                    <span class="text_geo">{{geo}}</span>
                                </div>
                                <div class="event-li__viewed">
                                    <img class="event-li__viewed-img" src="/img/viewed2.png">
                                    <span>{{viewed}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                {{/each}}
                </div>
            {{else}}
                <h2>Прости бро, нет таких ивентосов</h2>
            {{/if}}
        `;

        const template = window.Handlebars.compile(list);
        listBlock.innerHTML = template({events: events});
    }

    disableProfileForm() {
        this.#editForm?.disable();
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }
}
