import {EventData} from '../../../types.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class EventEditFormView {
    #parent: HTMLElement;
    #eventId?: number;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(event?: EventData) {
        this.#eventId = event?.id;
        const source = `  
            <div class="eventform-background">
                <div class="eventform">
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label event-text">Название</p>
                        <input class ="input-block__input form-input form-input_wide" id="titleInput" 
                        value="{{event.title}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label event-text">Краткое описание</p>
                        <textarea class ="input-block__input form-textarea" id="descriptionInput" rows="4" 
                        placeholder="{{event.description}}"></textarea>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label event-text">Описание</p>
                        <textarea class ="input-block__input form-textarea" id="textInput" rows="12" placeholder="{{event.text}}"></textarea>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label event-text">Дата проведения</p>
                        <input class ="input-block__input form-input form-input_thin" id="dateInput" type="date" 
                        value="{{event.date}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label event-text">Город</p>
                        <input class ="input-block__input form-input form-input_thin" id="cityInput" 
                        value="{{event.city}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label event-text">Адрес</p>
                        <input class ="input-block__input form-input form-input_thin" id="geoInput" 
                        value="{{event.geo}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label event-text">Категория</p>
                        <input class ="input-block__input form-input form-input_thin" id="categoryInput" 
                        value="{{event.category}}">
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label event-text">Теги</p>
                        <input class ="input-block__input form-input form-input_thin" id="tagInput">
                    </div>
                    <div class="eventform__buttons buttons">
                        <input value="Отмена" class="button-cancel">
                        <input type="submit" value="СОЗДАТЬ" class="button-save">
                    </div>
                </div>
            </div>
        `;

        const template: any = window.Handlebars.compile(source);
        this.#parent.innerHTML = template(event);

        this.#addListeners();
    }

    #addListeners() {
        const form = document.getElementById('eventform') as HTMLFormElement;
        form.addEventListener('submit', this.#editEvent.bind(this));
    }

    #removeListeners() {
        const form = document.getElementById('eventform') as HTMLFormElement;
        form.removeEventListener('submit', this.#editEvent.bind(this));
    }

    #editEvent(ev: Event) {
        ev.preventDefault();

        const titleInput = document.getElementById('titleInput') as HTMLInputElement;
        const title = titleInput.value;
        const descriptionInput = document.getElementById('descriptionInput') as HTMLInputElement;
        const description = descriptionInput.value;
        const textInput = document.getElementById('textInput') as HTMLInputElement;
        const text = textInput.value;
        const dateInput = document.getElementById('dateInput') as HTMLInputElement;
        const date = dateInput.value;
        const cityInput = document.getElementById('cityInput') as HTMLInputElement;
        const city = cityInput.value;
        const geoInput = document.getElementById('geoInput') as HTMLInputElement;
        const geo = geoInput.value;
        const categoryInput = document.getElementById('categoryInput') as HTMLInputElement;
        const category = categoryInput.value;
        const tagInput = document.getElementById('tagInput') as HTMLInputElement;
        const tag: string[] = [];
        tag.push(tagInput.value);

        const event: EventData = {id: this.#eventId, title, description, text, date, city, geo, category, tag};

        Bus.emit(Events.EventEditReq, event);
    }

    disable() {
        this.#removeListeners();

        this.#parent.innerHTML = '';
    }
}
