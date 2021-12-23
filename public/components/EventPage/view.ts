import { EventData, UrlPathnames, UserData } from '@/types';
import { Loader } from '@googlemaps/js-api-loader';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import userstore from '../../modules/userstore';
import * as template from '@event-page/templates/eventpage.hbs';
import * as friendsTemplate from '@templates/friendslist/friendslist.hbs';
import '@templates/friendslist/friendslist.scss';
import '@event-page/templates/EventPage.scss';

const KEY = process.env.MAPS_API_KEY?.toString();
const PLACES_LIB = 'places';
const MAPS_ERROR_STR = 'Ошибка подключения к картам';

const ZOOM = 16;

export default class EventPageView {
    #parent: HTMLElement;
    #event?: EventData;
    #renderedFriends?: NodeListOf<HTMLElement>;
    #friendsToInvite?: string[];

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(event: EventData, author: UserData) {
        this.#event = event;

        const permission = (this.#event.authorid === userstore.get()?.id);
        const shareURL = document.location.href;
        this.#parent.innerHTML = template({ event, permission, author, shareURL });

        this.#renderMap();

        this.#addListeners();

        Bus.emit(Events.EventFavReq);
    }

    #addListeners() {
        const editButton = document.getElementById('editButton');
        editButton?.addEventListener('click', this.#editHandle);

        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.addEventListener('click', this.#deleteHandle);

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.addEventListener('click', this.hidePopup.bind(this));

        const editPopupOpenButton = <HTMLElement>document.getElementById('editPopupOpen');
        editPopupOpenButton?.addEventListener('click', this.#showEditPopup.bind(this));

        const addFavouriteButton = document.getElementById('addFavourite');
        addFavouriteButton?.addEventListener('click', this.#addFavouriteHandle.bind(this));

        const removeFavouriteButton = document.getElementById('removeFavourite');
        removeFavouriteButton?.addEventListener('click', this.#removeFavouriteHandle.bind(this));

        const backButton = document.getElementById('backButton');
        backButton?.addEventListener('click', () => Bus.emit(Events.RouteBack));

        const shareIcon = document.getElementById('shareIcon');
        shareIcon?.addEventListener('click', this.#showSharePopup);

        const inviteIcon = document.getElementById('inviteIcon');
        inviteIcon?.addEventListener('click', this.#makeFriendsRequest);

        const copyLinkButton = document.getElementById('copy');
        copyLinkButton?.addEventListener('click', this.#copyLink);
    }

    #removeListeners() {
        const editButton = document.getElementById('editButton');
        editButton?.removeEventListener('click', this.#editHandle);

        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.removeEventListener('click', this.#deleteHandle);

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.removeEventListener('click', this.hidePopup.bind(this));

        const editPopupOpenButton = <HTMLElement>document.getElementById('editPopupOpen');
        editPopupOpenButton?.removeEventListener('click', this.#showEditPopup.bind(this));

        const addFavouriteButton = <HTMLElement>document.getElementById('addFavourite');
        addFavouriteButton?.removeEventListener('click', this.#addFavouriteHandle.bind(this));

        const removeFavouriteButton = <HTMLElement>document.getElementById('removeFavourite');
        removeFavouriteButton?.removeEventListener('click', this.#removeFavouriteHandle.bind(this));

        const backButton = document.getElementById('backButton');
        backButton?.removeEventListener('click', () => Bus.emit(Events.RouteBack));

        const shareIcon = document.getElementById('shareIcon');
        shareIcon?.removeEventListener('click', this.#showSharePopup);

        const inviteIcon = document.getElementById('inviteIcon');
        inviteIcon?.removeEventListener('click', this.#makeFriendsRequest);

        const copyLinkButton = document.getElementById('copy');
        copyLinkButton?.removeEventListener('click', this.#copyLink);

        this.#renderedFriends?.forEach((item) => {
            if (item)
                item.removeEventListener('click', this.#friendClicked.bind(this, item));
        });
    }

    #makeFriendsRequest = (() => {
        if (!userstore.get()) {
            Bus.emit(Events.RouteUrl, UrlPathnames.Login);
            return;
        }

        Bus.emit(Events.FriendsAvailableReq);
    });

    #friendClicked = ((item: HTMLElement) => {
        if (item.dataset.toinvite === 'true') {
            item.classList.remove('friend-list-item_clicked');

            this.#friendsToInvite?.splice(this.#friendsToInvite?.indexOf(<string>item.dataset.friendid), 1);
            item.dataset.toinvite = '';

            const inviteButton = <HTMLElement>document.getElementById('inviteButton');
            if (!this.#friendsToInvite) {
                inviteButton.classList.add('friend-list-button_notactive', 'button-gray');
                inviteButton.classList.remove('button-blue');
                inviteButton.removeEventListener('click', this.#makeInvitation);
            }
        } else {
            item.classList.add('friend-list-item_clicked');

            this.#friendsToInvite?.push(<string>item.dataset.friendid);
            item.dataset.toinvite = 'true';

            const inviteButton = <HTMLElement>document.getElementById('inviteButton');
            inviteButton.classList.remove('friend-list-button_notactive', 'button-gray');
            inviteButton.classList.add('button-blue');

            inviteButton.addEventListener('click', this.#makeInvitation);
        }
        console.log('friends to invite', this.#friendsToInvite);
    });

    #makeInvitation = (() => {
        Bus.emit(Events.InviteReq, this.#friendsToInvite);
    });

    #copyLink = ((e: Event) => {
        e.preventDefault();

        void navigator.clipboard.writeText(window.location.href);
    });

    showInvitePopup = ((availableFriends: UserData[], friends: UserData[]) => {
        this.#friendsToInvite = [];

        const popup = document.getElementById('invitePopup');
        popup?.classList.remove('popup_none');

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.classList.remove('popup_none');

        const friendList = <HTMLElement>document.getElementById('friendList');
        if (friendList)
            friendList.innerHTML = friendsTemplate({ 'users': friends });

        this.#renderedFriends = document.querySelectorAll('[data-friendid]');
        this.#renderedFriends.forEach((item) => {
            item.classList.remove('friend-list-item_clicked', 'friend-list-item_not-available');
            item.dataset.toinvite = '';
            if (item) {
                if (!availableFriends.filter(friend => friend.id === item.dataset.friendid)) {
                    item.classList.add('friend-list-item_not-available');
                } else {
                    item.addEventListener('click', this.#friendClicked.bind(this, item));
                }
            }
        });

        const inviteButton = <HTMLElement>document.getElementById('inviteButton');
        inviteButton.classList.add('friend-list-button_notactive', 'button-gray');
        inviteButton.classList.remove('button-blue');
    });

    #showSharePopup = ((e: Event) => {
        e.preventDefault();

        const popup = document.getElementById('sharePopup');
        popup?.classList.remove('popup_none');

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.classList.remove('popup_none');
    });

    #editHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.RouteUrl, UrlPathnames.Edit + '?id=' + this.#event?.id);
    });

    #deleteHandle = ((e: Event) => {
        e.preventDefault();

        Bus.emit(Events.EventDelete, this.#event?.id);
    });

    #addFavouriteHandle(e: Event) {
        e.preventDefault();

        if (!userstore.get()) {
            Bus.emit(Events.RouteUrl, UrlPathnames.Login);
        } else {
            Bus.emit(Events.EventAddFavReq, this.#event?.id);
        }
    }

    #removeFavouriteHandle(e: Event) {
        e.preventDefault();

        Bus.emit(Events.EventRemoveFavReq, this.#event?.id);
    }

    hidePopup() {
        const editPopup = document.getElementById('editPopup');
        const sharePopup = document.getElementById('sharePopup');
        const invitePopup = document.getElementById('invitePopup');
        editPopup?.classList.add('popup_none');
        sharePopup?.classList.add('popup_none');
        invitePopup?.classList.add('popup_none');

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.classList.add('popup_none');

        const inviteButton = <HTMLElement>document.getElementById('inviteButton');
        if (inviteButton) {
            inviteButton.removeEventListener('click', this.#makeInvitation);
        }
    }

    #showEditPopup() {
        const popup = document.getElementById('editPopup');
        popup?.classList.remove('popup_none');

        const overlay = <HTMLElement>document.getElementById('overlay');
        overlay?.classList.remove('popup_none');
    }

    disable() {
        this.#removeListeners();
        this.#parent.innerHTML = '';
    }

    #renderMap() {
        let loader!: Loader;
        if (KEY) {
            loader = new Loader({
                apiKey: KEY,
                libraries: [PLACES_LIB],
            });
        }

        if (loader) {
            const container = <HTMLElement>document.getElementById('mapContainer');
            if (!container)
                return;

            void loader.load().then(() => {
                const map = new google.maps.Map(container, {
                    zoom: ZOOM,
                });

                const geo = this.#event?.geo.replace('(', '');
                const latLng = <string[]>geo?.split(',', 2);
                const lat = parseFloat(latLng[0]);
                const lng = parseFloat(latLng[1]);
                const parsedPosition = new google.maps.LatLng(lat, lng);

                const marker = new google.maps.Marker({
                    map: map,
                    title: this.#event?.title,
                    position: parsedPosition,
                });

                map.setCenter(parsedPosition);
                map.setZoom(ZOOM);
            }).catch(() => {
                container.textContent = MAPS_ERROR_STR;
            });
        }
    }

    renderFavBlock(isFavourite: boolean) {
        const addFavouriteButton = <HTMLElement>document.getElementById('addFavourite');
        const removeFavouriteButton = <HTMLElement>document.getElementById('removeFavourite');

        if (isFavourite) {
            addFavouriteButton?.classList.add('buttons-block-wrapper_none');
            removeFavouriteButton?.classList.remove('buttons-block-wrapper_none');
        } else {
            addFavouriteButton?.classList.remove('buttons-block-wrapper_none');
            removeFavouriteButton?.classList.add('buttons-block-wrapper_none');
        }
    }

}
