import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import { UserData } from '@/types';
import * as template from '@header/templates/header.hbs';
import '@header/templates/Header.css';
import FilterStore, { FilterParams } from '@/modules/filter';

export default class HeaderView {
    #parent: HTMLElement;
    #input?: HTMLInputElement;
    #popupShown?: boolean;
    #headerFocusIds = ['header-input', 'header-search', 'header-calendar'];
    #headerClickIds = ['header', 'header-logo'];

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.UserRes, this.#userHandle);
        Bus.on(Events.UserError, this.#userHandle);
        Bus.on(Events.RouteChange, this.#handleRouteChange);
    }

    #addListeners() {
        if (this.#input) this.#input.addEventListener('input', this.#inputHandle);

        const avatar = <HTMLElement>document.getElementById('header-avatar');
        if (avatar) avatar.addEventListener('click', this.#handleAvatar);

        const overlay = <HTMLElement>document.getElementById('header-overlay');
        if (overlay) overlay.addEventListener('click', this.#handleOverlayClick);
    }

    #removeListeners() {
        if (this.#input) this.#input.removeEventListener('input', this.#inputHandle);

        const avatar = <HTMLElement>document.getElementById('header-avatar');
        if (avatar) avatar.removeEventListener('click', this.#handleAvatar);

        const overlay = <HTMLElement>document.getElementById('header-overlay');
        if (overlay) overlay.removeEventListener('click', this.#handleOverlayClick);
    }

    #handleRouteChange = () => {
        this.#renderFilter();
    };

    #handleAvatar = (e: MouseEvent) => {
        e.stopPropagation();
        this.#toggleOverlay();
    };

    #handleEscape = (e: KeyboardEvent) => {
        if (e.code !== 'Escape') return;
        this.#toggleOverlay();
    };

    #handleOverlayClick = () => {
        if (this.#popupShown) {
            this.#toggleOverlay();
        }
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
        const overlay = <HTMLElement>document.getElementById('header-overlay');
        if (!overlay) return;
        if (this.#popupShown) {
            overlay.classList.remove('header-overlay_shown');
            overlay.classList.add('header-overlay_hidden');
        } else {
            overlay.classList.remove('header-overlay_hidden');
            overlay.classList.add('header-overlay_shown');
        }
        this.#popupShown = !this.#popupShown;
        this.#listenOverlay();
    };

    #inputHandle = (() => {
        const value = this.#input?.value;
        FilterStore.set(FilterParams.Query, value);
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

    #renderFilter() {
        const filter = FilterStore.get();
        if (this.#input) {
            if (filter['query']) {
                this.#input.value = filter['query'];
            } else {
                this.#input.value = '';
            }
        }
    }

    render(user?: UserData) {
        this.#popupShown = false;
        const authAnchors = config.authAnchors;
        this.#parent.innerHTML = template({ authAnchors, user });
        this.#input = <HTMLInputElement>document.getElementById('header-input');

        this.#addListeners();
        this.#renderFilter();
    }

    disable() {
        this.#removeListeners();
        Bus.off(Events.UserRes, this.#userHandle);
        Bus.off(Events.UserError, this.#logoutHandle);
        Bus.off(Events.RouteChange, this.#handleRouteChange);
        this.#parent.innerHTML = '';
    }
}
