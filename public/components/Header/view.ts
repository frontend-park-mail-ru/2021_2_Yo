import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import { UserData, UrlPathnames } from '@/types';
import * as template from '@header/templates/header.hbs';
import '@header/templates/Header.css';
import { filterToUrl } from '@/modules/filter';

export default class HeaderView {
    #parent: HTMLElement;
    #logo?: HTMLElement;
    #input?: HTMLInputElement;
    #search?: HTMLElement;
    #logout?: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.UserRes, this.#userHandle);
        Bus.on(Events.UserError, this.#userHandle);
    }

    #addListeners() {
        this.#logo = <HTMLElement>document.getElementById('header-logo');
        this.#input = <HTMLInputElement>document.getElementById('header-input');
        this.#search = <HTMLElement>document.getElementById('header-search');
        this.#logout = <HTMLElement>document.getElementById('header-logout');

        if (this.#logout) {
            this.#logout.addEventListener('click', this.#logoutHandle);
        }

        if (this.#input) {
            this.#input.addEventListener('keypress', this.#inputHandle);
        }

        if (this.#search) {
            this.#search.addEventListener('click', this.#searchHandle);
        }

        if (this.#logo) {
            this.#logo.addEventListener('click', this.#logoHandle);
        }
    }

    #removeListeners() {
        if (this.#logout) {
            this.#logout.removeEventListener('click', this.#logoutHandle);
        }

        if (this.#input) {
            this.#input.removeEventListener('keypress', this.#inputHandle);
        }

        if (this.#search) {
            this.#search.removeEventListener('click', this.#searchHandle);
        }

        if (this.#logo) {
            this.#logo.removeEventListener('click', this.#logoHandle);
        }
    }

    #logoHandle = (() => {
        Bus.emit(Events.RouteUrl, UrlPathnames.Main);
    }).bind(this);

    #inputHandle = ((e: KeyboardEvent) => {
        if (e.code !== 'Enter') return;
        const value = this.#input?.value;
        const params = filterToUrl({query: value});
        Bus.emit(Events.RouteUrl, UrlPathnames.Search + params);
        (<HTMLInputElement>(this.#input)).value = '';
    }).bind(this);

    #searchHandle = (() => {
        const value = this.#input?.value;
        const params = filterToUrl({query: value});
        Bus.emit(Events.RouteUrl, UrlPathnames.Search + params);
        (<HTMLInputElement>(this.#input)).value = '';
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
