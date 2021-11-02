import { EventData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as errorTemplate from '@main-page/EventBoard/eventerror.hbs';
import * as template from '@main-page/EventBoard/eventboard.hbs';
import '@main-page/EventBoard/EventBoard.css';

export default class EventBoardComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.on(Events.EventsRes, this.#eventsHandle);
        Bus.on(Events.EventsError, this.#eventsError);
        Bus.emit(Events.EventsReq);
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
        if (data) {
            while (data.length < 13) {
                data.push(data[0]);
            }
            data = data.map(e => {
                e.description = 'Маскарат. Не советуем.';
                return e;
            });
        }
        
        this.#parent.innerHTML = template(data);
    }

    disable() {
        Bus.off(Events.EventsRes, this.#eventsHandle);
        Bus.off(Events.EventsError, this.#eventsError);

        this.#parent.innerHTML = '';
    }
}
