import { EventData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as errorTemplate from '@main-page/EventBoard/eventerror.hbs';
import * as template from '@main-page/EventBoard/eventboard.hbs';
import * as eventTemplate from '@main-page/EventBoard/eventcard.hbs';
import '@main-page/EventBoard/EventBoard.css';

export default class EventBoardComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.on(Events.EventsRes, this.#eventsHandle);
        Bus.on(Events.EventsError, this.#eventsError);
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

    render(data?: EventData[]) {
        // Временные меры (пока не хотим контактировать с беком)
        // data = data?.slice(0, 13);
        
        this.#parent.innerHTML = template();
        if (data) {
            const cols = ['0', '1', '2'].map(num => <HTMLElement>document.getElementById('event-column-' + num));
            data.map((event, index) => {
                const colNum = index % 3;
                cols[colNum].innerHTML += eventTemplate(event);
            });
        }
    }

    disable() {
        Bus.off(Events.EventsRes, this.#eventsHandle);
        Bus.off(Events.EventsError, this.#eventsError);

        this.#parent.innerHTML = '';
    }
}
