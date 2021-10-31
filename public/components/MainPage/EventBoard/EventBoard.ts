import { EventCardData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as errorTemplate from '@main-page/EventBoard/error-template.hbs';
import * as template from '@main-page/EventBoard/template.hbs';

export default class EventBoardComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.on(Events.EventsRes, this.#eventsHandle);
        Bus.on(Events.EventsError, this.#eventsError);
        Bus.emit(Events.EventsReq);
        this.#parent = parent;
    }

    #eventsHandle = ((data: EventCardData[]) => {
        this.render(data);
    }).bind(this);

    #eventsError = (() => {
        this.error();
    }).bind(this);

    error() {
        this.#parent.innerHTML = errorTemplate();
    }

    render(data?: EventCardData[]) {
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
