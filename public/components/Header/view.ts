import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import { UserData, UrlPathnames } from '@/types';
import * as template from '@header/templates/header.hbs';
import '@header/templates/Header.css';
import { filterToUrl } from '@/modules/filter';

export default class HeaderView {
    #parent: HTMLElement;
    #popupShown?: boolean;
    #headerFocusIds = ['header-input', 'header-search', 'header-calendar'];
    #headerClickIds = ['header', 'header-logo'];

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.UserRes, this.#userHandle);
        Bus.on(Events.UserError, this.#userHandle);
    }

    #addListeners() {
        const input = <HTMLInputElement>document.getElementById('header-input');
        if (input) input.addEventListener('keypress', this.#inputHandle);

        const search = <HTMLElement>document.getElementById('header-search');
        if (search) search.addEventListener('click', this.#searchHandle);

        const avatar = <HTMLElement>document.getElementById('header-avatar');
        if (avatar) avatar.addEventListener('click', this.#handleAvatar);

        const overlay = <HTMLElement>document.getElementById('header-overlay');
        if (overlay) overlay.addEventListener('click', this.#toggleOverlay);
    }

    #removeListeners() {
        const input = <HTMLInputElement>document.getElementById('header-input');
        if (input) input.removeEventListener('keypress', this.#inputHandle);

        const search = <HTMLElement>document.getElementById('header-search');
        if (search) search.removeEventListener('click', this.#searchHandle);

        const avatar = <HTMLElement>document.getElementById('header-avatar');
        if (avatar) avatar.removeEventListener('click', this.#handleAvatar);

        const overlay = <HTMLElement>document.getElementById('header-overlay');
        if (overlay) overlay.removeEventListener('click', this.#toggleOverlay);
    }

    #handleAvatar = (e: MouseEvent) => {
        e.stopPropagation();
        this.#toggleOverlay();
    };

    #handleEscape = (e: KeyboardEvent) => {
        if (e.code !== 'Escape') return;
        this.#toggleOverlay();
    };

    #listenOverlay() {
        if (this.#popupShown) {
            this.#headerFocusIds.map(id => {
                const element = <HTMLElement>document.getElementById(id);
                if (element) element.addEventListener('focus', this.#toggleOverlay);
            });
            this.#headerClickIds.map(id => {
                const element = <HTMLElement>document.getElementById(id);
                if (element) element.addEventListener('click', this.#toggleOverlay);
            });
            const logout = document.getElementById('header-logout');
            if (logout) logout.addEventListener('click', this.#logoutHandle);

            window.addEventListener('keydown', this.#handleEscape);
        } else {
            this.#headerFocusIds.map(id => {
                const element = <HTMLElement>document.getElementById(id);
                if (element) element.removeEventListener('focus', this.#toggleOverlay);
            });
            this.#headerClickIds.map(id => {
                const element = <HTMLElement>document.getElementById(id);
                if (element) element.removeEventListener('click', this.#toggleOverlay);
            });
            const logout = document.getElementById('header-logout');
            if (logout) logout.removeEventListener('click', this.#logoutHandle);

            window.removeEventListener('keydown', this.#handleEscape);
        }
    }

    #toggleOverlay = () => {
        const avatar = <HTMLElement>document.getElementById('header-avatar');
        const overlay = <HTMLElement>document.getElementById('header-overlay');
        if (!avatar || !overlay) return;
        if (this.#popupShown) {
            avatar.classList.remove('header__avatar-wrapper_checked');
            overlay.classList.remove('header-overlay_shown');
            overlay.classList.add('header-overlay_hidden');
        } else {
            avatar.classList.add('header__avatar-wrapper_checked');
            overlay.classList.remove('header-overlay_hidden');
            overlay.classList.add('header-overlay_shown');
        }
        this.#popupShown = !this.#popupShown;
        this.#listenOverlay();
    };

    #inputHandle = ((e: KeyboardEvent) => {
        if (e.code !== 'Enter') return;
        const input = <HTMLInputElement>e.currentTarget;
        const value = input.value;
        const params = filterToUrl({query: value});
        Bus.emit(Events.RouteUrl, UrlPathnames.Main + params);
        input.value = '';
    }).bind(this);

    #searchHandle = (() => {
        const input = <HTMLInputElement>document.getElementById('header-input');
        const value = input.value;
        const params = filterToUrl({query: value});
        Bus.emit(Events.RouteUrl, UrlPathnames.Main + params);
        // input.value = '';
    }).bind(this);

    #logoutHandle = (() => {
        this.#popupShown = !this.#popupShown;
        this.#listenOverlay();
        Bus.emit(Events.UserLogout);
        this.render();
    }).bind(this);

    #userHandle = ((user: UserData) => {
        this.render(user);
    }).bind(this);

    render(user?: UserData) {
        this.#popupShown = false;
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
