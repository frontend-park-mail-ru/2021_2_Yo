import Bus from '../../modules/eventbus/eventbus';
import Events from '../../modules/eventbus/events';
import { anchorsConfig } from '../../config';
import { UserData, UrlPathnames } from '../../types';
import * as template from '@header/template.hbs';

export default class HeaderView {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.UserRes, this.#userHandle);
        Bus.on(Events.UserError, this.#logoutHandle);
        Bus.on(Events.UserLogout, this.#logoutHandle);
    }

    #addListeners() {
        const logout = document.getElementById('header-logout');
        if (logout) {
            logout.addEventListener('click', this.#logoutHandle);
        }

        const logo = document.getElementById('header-logo');
        if (logo) {
            logo.addEventListener('click', this.#logoHandle);
        }
    }

    #removeListeners() {
        const logout = <HTMLElement>document.getElementById('header-logout');
        if (logout) {
            logout.removeEventListener('click', this.#logoutHandle);
        }

        const logo = document.getElementById('header-logo');
        if (logo) {
            logo.removeEventListener('click', this.#logoHandle);
        }
    }

    #logoHandle = (() => {
        Bus.emit(Events.RouteUrl, UrlPathnames.Main);
    }).bind(this);

    #logoutHandle = (() => {
        this.#render();
    }).bind(this);

    #userHandle = ((user: UserData) => {
        this.#render(user);
    }).bind(this);

    #render(user?: UserData) {
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
