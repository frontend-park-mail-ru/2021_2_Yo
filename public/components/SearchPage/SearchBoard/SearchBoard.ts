import { EventData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as errorTemplate from '@search-page/SearchBoard/eventerror.hbs';
import * as listTemplate from '@templates/eventlist/eventlist.hbs';
import * as template from '@search-page/SearchBoard/searchboard.hbs';
import '@search-page/SearchBoard/SearchBoard.css';
import '@templates/eventlist/eventlist.css';

export default class SearchBoard {
    #parent: HTMLElement;
    #query?: string;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        Bus.on(Events.EventsRes, this.#handleEvents);
        Bus.on(Events.EventsError, this.#handleEventsError);
    }

    #handleEvents = ((events: EventData[]) => {
        this.#renderEvents(events);
    }).bind(this);

    #handleEventsError = (() => {
        this.#renderError();
    }).bind(this);

    #renderError() {
        const content = <HTMLElement>document.getElementById('search-content');
        content.innerHTML = errorTemplate();
    }

    #renderEvents(events: EventData[]) {
        const content = <HTMLElement>document.getElementById('search-content');
        content.innerHTML = listTemplate({events: events});
    }

    renderQuery(query: string | undefined) {
        if (!query) query = '';
        this.#query = query;
        const input = <HTMLInputElement>document.getElementById('query-input');
        if (input) input.value = query;
    }

    addListeners() {
        const input = <HTMLInputElement>document.getElementById('query-input');
        if (!input) return;
        input.addEventListener('input', this.#handleInput);
    }

    #handleInput = ((e: Event) => {
        const input = <HTMLInputElement>e.target;
        if (!input) return;
        const value = input.value.trim();
        // if (value === '') return;

        this.#query = value;

        const handle = ((query: string | undefined) => {
            if (!query) query = '';
            if (query === this.#query) {
                Bus.emit(Events.QueryChange, query);
            }
        }).bind(this);     
        setTimeout(handle, 500, this.#query);
    }).bind(this);

    removeListeners() {
        const input = <HTMLInputElement>document.getElementById('query-input');
        if (!input) return;
        input.addEventListener('input', this.#handleInput);
    }

    render() {
        this.#parent.innerHTML = template();
        this.addListeners();
    }

    disable() {
        this.removeListeners();
        Bus.off(Events.EventsRes, this.#handleEvents);
        Bus.off(Events.EventsError, this.#handleEventsError);
        this.#parent.innerHTML = '';
    }
}
