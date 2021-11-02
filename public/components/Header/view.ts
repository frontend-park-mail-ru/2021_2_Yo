import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import UserStore from '../../modules/userstore.js';
import {anchorsConfig} from '../../config.js';
import {UrlPathnames, UserData} from '../../types.js';

export default class HeaderView {
    #parent: HTMLElement;
    #avatar?: HTMLElement;
    #logout?: HTMLElement;
    #logo?: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.UserRes, this.#userHandle);
        Bus.on(Events.UserError, this.#userHandle);
    }

    #addListeners() {
        this.#avatar = <HTMLElement>document.getElementById('avatar');
        this.#logout = <HTMLElement>document.getElementById('header-logout');
        this.#logo = <HTMLElement>document.getElementById('header-logo');

        if (this.#logout) {
            this.#logout.addEventListener('click', this.#logoutHandle);
        }

        if (this.#avatar) {
            this.#avatar.addEventListener('click', this.#avatarHandle);
        }

        if (this.#logo) {
            this.#logo.addEventListener('click', this.#logoHandle);
        }
    }

    #removeListeners() {
        if (this.#logout) {
            this.#logout.removeEventListener('click', this.#logoutHandle);
        }

        if (this.#avatar) {
            this.#avatar.removeEventListener('click', this.#avatarHandle);
        }

        if (this.#logo) {
            this.#logo.removeEventListener('click', this.#logoHandle);
        }
    }

    #logoHandle = (() => {
        Bus.emit(Events.RouteUrl, UrlPathnames.Main);
    }).bind(this);

    #avatarHandle = (() => {
        const id = UserStore.get()?.id;
        Bus.emit(Events.RouteUrl, UrlPathnames.Profile + '?id=' + id);
    }).bind(this);

    #logoutHandle = (() => {
        Bus.emit(Events.UserLogout);
        this.#render();
    }).bind(this);

    #userHandle = ((user?: UserData) => {
        this.#render(user);
    }).bind(this);

    #render(user?: UserData) {
        const source = `
            <header class="header">
                <div class="flex header__content header-text">
                    <img id="header-logo" class="header__logo header-button" src="./img/logo2.0.png">
                    {{#if user}}
                        <div class="flex">
                            <img id="geoimg" src="./img/geo2.0.png">
                            <span class="header-text_decoration_underline">{{user.geo}}</span>
                        </div>
                    {{/if}}
                    <div class="flex header__search">
                        <input class="header__search-input" type="text" placeholder="Найдем тусу под ваши вкусы...">
                        <img class="header-button" src="./img/filter2.0.png">
                    </div>
                    <div class="flex header__calendar">
                        <img class="header-button" src="./img/calendar2.0.png">
                        <span class="header-text_decoration_underline">Календарь событий</span>
                    </div>
                    {{#if user}}
                        <div class="flex">
                            <img id="avatar" class="header__user-avatar" 
                                 src="https://source.boringavatars.com/marble/32/{{user.name}}">
                            <span>{{user.name}}</span>
                        </div>
                        <img id="header-logout" class="header-button" src="./img/logout2.0.png">
                    {{else}}
                        <div>
                        {{#each authAnchors}}
                            <a class="header__auth-anchor" href="{{href}}">{{name}}</a>
                        {{/each}}
                        </div>
                    {{/if}}
                </div>
            </header>
        `;
        const template = window.Handlebars.compile(source);
        const authAnchors = anchorsConfig.authAnchors;
        this.#parent.innerHTML = template({authAnchors, user});

        this.#addListeners();
    }

    disable() {
        this.#removeListeners();
        Bus.off(Events.UserRes, this.#userHandle);
        Bus.off(Events.UserLogout, this.#logoutHandle);
        Bus.off(Events.UserError, this.#logoutHandle);
        this.#parent.innerHTML = '';
    }
}
