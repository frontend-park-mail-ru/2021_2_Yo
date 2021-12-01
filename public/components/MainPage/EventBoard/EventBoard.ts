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

const WIDTH_BREAKPOINTS = [
    0,
    // 650,
    // 450,
    451,
    // 500,
    1450,
];

// const WIDTH_BREAKPOINTS = [
//     700,
//     1030,
//     1450,
// ];

const RESIZE_MSEC = 50;

export default class EventBoardComponent {
    #parent: HTMLElement;
    #board?: HTMLElement;
    #cols: number;

    constructor(parent: HTMLElement) {
        Bus.on(Events.EventsRes, this.#eventsHandle);
        Bus.on(Events.EventsStoredRes, this.#eventsStoredHandle);
        Bus.on(Events.EventsError, this.#eventsError);
        Bus.on(Events.UserRes, this.#handleUser);
        Bus.on(Events.UserLogout, this.#handleUser);
        this.#parent = parent;
        this.#cols = this.#colsCount();
    }

    #colsCount() {
        let cols = 0;
        const currentWidth = document.documentElement.clientWidth;
        WIDTH_BREAKPOINTS.map(width => {
            if (currentWidth >= width) {
                cols += 1;
            }
        });
        return cols;
    }

    #eventsStoredHandle = (data: EventData[]) => {
        // this.#cols = this.#colsCount();   
        this.render(data);
    };

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
        window.addEventListener('resize', this.#handleResize);
    }

    #handleResize = () => {
        const cols = this.#colsCount();
        if (this.#cols === cols) return;
        this.#cols = cols;

        const callback = (cols: number) => {
            const currentCols = this.#colsCount();
            if (cols !== currentCols) return;
            Bus.emit(Events.EventsStoredReq);
        };

        setTimeout(callback, RESIZE_MSEC, this.#cols);
    };

    // #handleResize = () => {
    //     const cols = this.#colsCount();
    //     if (this.#cols === cols) return;
    //     this.#cols = cols;
    //     Bus.emit(Events.EventsStoredReq);
    // };

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
        window.addEventListener('resize', this.#handleResize);
    }

    #handleUser = () => {
        Bus.emit(Events.EventsReq);
    };

    render(data?: EventData[]) {
        this.#parent.innerHTML = '';
        const user = UserStore.get() ? true : false;

        for (let i = 0; i < this.#cols; i++) {
            this.#parent.innerHTML += template(i);
        }
        if (data) {
            // const colElements = this.#cols.map(num => <HTMLElement>document.getElementById('event-column-' + num));
            // const cols = ['0', '1', '2'].map(num => <HTMLElement>document.getElementById('event-column-' + num));
            const cols: HTMLElement[] = [];
            for (let i = 0; i < this.#cols; i++) {
                const col = <HTMLElement>document.getElementById('event-column-' + i.toString());
                cols.push(col);
            }
            data.map((event, index) => {
                const colNum = index % this.#cols;
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
        Bus.off(Events.EventsStoredRes, this.#eventsStoredHandle);
        Bus.off(Events.EventsError, this.#eventsError);
        Bus.off(Events.UserRes, this.#handleUser);
        Bus.off(Events.UserLogout, this.#handleUser);
        this.#removeListeners();

        this.#parent.innerHTML = '';
    }
}
