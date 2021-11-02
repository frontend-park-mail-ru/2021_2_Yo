import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import { UserData, UrlPathnames } from '@/types';
import * as template from '@header/templates/header.hbs';
import '@header/templates/Header.css';

export default class HeaderView {
    #parent: HTMLElement;
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
        this.#logout = <HTMLElement>document.getElementById('header-logout');
        this.#logo = <HTMLElement>document.getElementById('header-logo');

        if (this.#logout) {
            this.#logout.addEventListener('click', this.#logoutHandle);
        }

        if (this.#logo) {
            this.#logo.addEventListener('click', this.#logoHandle);
        }
    }

    #removeListeners() {
        if (this.#logout) {
            this.#logout.removeEventListener('click', this.#logoutHandle);
        }

        if (this.#logo) {
            this.#logo.removeEventListener('click', this.#logoHandle);
        }
    }

    #logoHandle = (() => {
        Bus.emit(Events.RouteUrl, UrlPathnames.Main);
    }).bind(this);

    #logoutHandle = (() => {
        Bus.emit(Events.UserLogout);
        this.render();
    }).bind(this);

    #userHandle = ((user: UserData) => {
        this.render(user);
    }).bind(this);

    render(user?: UserData) {
        const authAnchors = config.authAnchors;
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
