import { EventData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as errorTemplate from '@main-page/EventBoard/eventerror.hbs';
import * as template from '@main-page/EventBoard/eventboard.hbs';
import * as eventTemplate from '@main-page/EventBoard/eventcard.hbs';
import * as eventFavOnTemplate from '@main-page/EventBoard/eventfavon.hbs';
import * as eventFavOffTemplate from '@main-page/EventBoard/eventfavoff.hbs';
import '@main-page/EventBoard/EventBoard.css';
import UserStore from '@/modules/userstore';

export default class EventBoardComponent {
    #parent: HTMLElement;
    #board?: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.on(Events.EventsRes, this.#eventsHandle);
        Bus.on(Events.EventsError, this.#eventsError);
        Bus.on(Events.UserRes, this.#handleUser);
        Bus.on(Events.UserLogout, this.#handleUser);
        this.#parent = parent;
    }

    #eventsHandle = ((data: EventData[]) => {
        this.render(data);
    }).bind(this);

    #eventsError = (() => {
        this.error();
    }).bind(this);

    error() {
        this.#parent.innerHTML = errorTemplate();
    }

    #addListeners() {
        if (this.#board) this.#board.addEventListener('click', this.#handleClick);
    }

    #handleClick = (e: MouseEvent) => {
        const target = <HTMLElement>e.target;
        const id = target.dataset['fav'];
        if (id) {
            const fav = <HTMLElement>document.getElementById('event-fav-' + id);
            if (target.dataset['status'] === 'on') {
                Bus.emit(Events.EventRemoveFavReq, id);
                if (fav) fav.outerHTML = eventFavOffTemplate(id);
            } else {
                Bus.emit(Events.EventAddFavReq, id);
                if (fav) fav.outerHTML = eventFavOnTemplate(id);
            }
        }
    };

    #removeListeners() {
        if (this.#board) this.#board.removeEventListener('click', this.#handleClick);
    }

    #handleUser = () => {
        Bus.emit(Events.EventsReq);
    };

    render(data?: EventData[]) {
        const user = UserStore.get() ? true : false;
        this.#parent.innerHTML = template();
        if (data) {
            const cols = ['0', '1', '2'].map(num => <HTMLElement>document.getElementById('event-column-' + num));
            data.map((event, index) => {
                const colNum = index % 3;
                cols[colNum].innerHTML += eventTemplate({
                    event: event,
                    user: user,
                });
            });
        }
        this.#board = <HTMLElement>document.getElementById('event-board-wrapper');
        this.#addListeners();
    }

    disable() {
        Bus.off(Events.EventsRes, this.#eventsHandle);
        Bus.off(Events.EventsError, this.#eventsError);
        Bus.off(Events.UserRes, this.#handleUser);
        Bus.off(Events.UserLogout, this.#handleUser);
        this.#removeListeners();

        this.#parent.innerHTML = '';
    }
}
