import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import config from '@/config';
import { UserData } from '@/types';
import * as template from '@header/templates/header.hbs';
import * as notificationSubscribeTemplate from '@header/templates/notificationsubscribe.hbs';
import * as notificationInviteTemplate from '@header/templates/notificationinvite.hbs';
import * as notificationCreateTemplate from '@header/templates/notificationcreate.hbs';
import '@header/templates/Header.css';
import FilterStore, { FilterParams } from '@/modules/filter';

const notifications = [
    notificationSubscribeTemplate,
    notificationInviteTemplate,
    notificationCreateTemplate,
];

enum PopupStatus {
    Hidden = -1,
    Notifications = 0,
    User = 1,
}

export default class HeaderView {
    #parent: HTMLElement;
    #input?: HTMLInputElement;
    #overlay?: HTMLElement;
    #popupStatus: PopupStatus = PopupStatus.Hidden;
    #headerFocusIds = ['header-input', 'header-calendar'];
    #headerClickIds = ['header', 'header-logo'];
    #headerPopups: HTMLElement[] = [];

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

        const notifications = <HTMLElement>document.getElementById('header-notifications');
        if (notifications) notifications.addEventListener('click', this.#handleNotifications);

        if (this.#overlay) this.#overlay.addEventListener('click', this.#handleOverlayClick);
    }

    #removeListeners() {
        if (this.#input) this.#input.removeEventListener('input', this.#inputHandle);

        const avatar = <HTMLElement>document.getElementById('header-avatar');
        if (avatar) avatar.removeEventListener('click', this.#handleAvatar);

        const notifications = <HTMLElement>document.getElementById('header-notifications');
        if (notifications) notifications.removeEventListener('click', this.#handleNotifications);

        if (this.#overlay) this.#overlay.removeEventListener('click', this.#handleOverlayClick);
    }

    #handleRouteChange = () => {
        this.#renderFilter();
    };

    #handleNotifications = (e: MouseEvent) => {
        e.stopPropagation();
        this.#toggleOverlay(e);
    };

    #handleAvatar = (e: MouseEvent) => {
        e.stopPropagation();
        this.#toggleOverlay(e);
    };

    #handleEscape = (e: KeyboardEvent) => {
        if (e.code !== 'Escape') return;
        this.#toggleOverlay();
    };

    #handleOverlayClick = () => {
        if (this.#popupStatus !== PopupStatus.Hidden) {
            this.#toggleOverlay();
        }
    };

    #listenOverlay() {
        if (this.#popupStatus !== PopupStatus.Hidden) {
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

    #toggleOverlay = (e?: Event) => {
        if (!this.#overlay) return;
        let needRefresh = false;
        const target = <HTMLElement>e?.currentTarget;
        if (!target || target.dataset['popupnum'] === undefined || +target.dataset['popupnum'] === this.#popupStatus) {
            this.#overlay.classList.remove('header-overlay_shown');
            this.#overlay.classList.add('header-overlay_hidden');
            this.#headerPopups.map(popup => popup.classList.add('hidden'));
            this.#popupStatus = PopupStatus.Hidden;
            needRefresh = true;
        } else {
            const popupNum = +target.dataset['popupnum'];
            if (this.#popupStatus === PopupStatus.Hidden) {
                this.#overlay.classList.remove('header-overlay_hidden');
                this.#overlay.classList.add('header-overlay_shown');
                needRefresh = true;
            } else {
                this.#headerPopups[this.#popupStatus].classList.add('hidden');
            }
            this.#headerPopups[popupNum].classList.remove('hidden');
            this.#popupStatus = popupNum;
        }

        if (needRefresh) this.#listenOverlay();
    };

    #inputHandle = () => {
        const value = this.#input?.value;
        FilterStore.set(FilterParams.Query, value);
    };

    #logoutHandle = () => {
        this.#popupStatus = PopupStatus.Hidden;
        this.#listenOverlay();
        Bus.emit(Events.UserLogout);
        this.render();
    };

    #userHandle = (user: UserData) => {
        this.render(user);
    };

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

    #renderNotifications() {
        this.#headerPopups[0].innerHTML = '';
        this.#headerPopups[0].innerHTML = notifications.reduce((prev, curr) => prev += curr(), '');
        this.#headerPopups[0].innerHTML += notifications.reduce((prev, curr) => prev += curr(), '');
    }

    render(user?: UserData) {
        this.#popupStatus = PopupStatus.Hidden;
        const authAnchors = config.authAnchors;
        this.#parent.innerHTML = template({ authAnchors, user });
        this.#input = <HTMLInputElement>document.getElementById('header-input');
        this.#overlay = <HTMLElement>document.getElementById('header-overlay');
        this.#headerPopups = ['notifications-popup', 'user-popup'].map(id => <HTMLElement>document.getElementById(id));

        this.#addListeners();
        this.#renderFilter();
        this.#renderNotifications();
    }

    disable() {
        this.#removeListeners();
        Bus.off(Events.UserRes, this.#userHandle);
        Bus.off(Events.UserError, this.#logoutHandle);
        Bus.off(Events.RouteChange, this.#handleRouteChange);
        this.#parent.innerHTML = '';
    }
}
