import {EventData} from '../../../types.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class EventFormView {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(event?: EventData) {
        const source = `  
                <div class="eventform-background">
                    <form class="eventform" id="eventform">
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Название</p>
                            <input class ="input-block__input form-input form-input_wide" id="titleInput"/>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Краткое описание</p>
                            <textarea class ="input-block__input form-textarea" id="descriptionInput" rows="4"></textarea>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Описание</p>
                            <textarea class ="input-block__input form-textarea" id="textInput" rows="12"></textarea>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Дата проведения</p>
                            <input class ="input-block__input form-input form-input_thin" id="dateInput"/>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Город</p>
                            <input class ="input-block__input form-input form-input_thin" id="cityInput"/>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Адрес</p>
                            <input class ="input-block__input form-input form-input_thin" id="geoInput">
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Категория</p>
                            <input class ="input-block__input form-input form-input_thin" id="categoryInput">
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Теги</p>
                            <input class ="input-block__input form-input form-input_thin" id="tagInput">
                        </div>
                        <div class="eventform__buttons buttons">
                            <input value="Отмена" class="button-cancel">
                            <input type="submit" value="СОЗДАТЬ" class="button-save">
                        </div>
                    </form>
                </div>
        `;

        const template: any = window.Handlebars.compile(source);
        this.#parent.innerHTML = template(event);

        this.#addListeners();
    }

    #addListeners() {
        const form = document.getElementById('eventform') as HTMLFormElement;
        form.addEventListener('submit', this.#createEvent.bind(this));
    }

    #removeListeners() {
        const form = document.getElementById('eventform') as HTMLFormElement;
        form.removeEventListener('submit', this.#createEvent.bind(this));
    }

    #createEvent(ev: Event) {
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

        const event: EventData = {title, description, text, date, city, geo, category, tag};

        Bus.emit(Events.EventCreate, event);
    }

    disable() {
        this.#removeListeners();

        this.#parent.innerHTML = '';
    }
}
