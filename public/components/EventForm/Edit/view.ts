import {EventData} from '../../../types.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class EventEditFormView {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(event?: EventData) {
        const source = `  
            <div class="eventform-background">
                <form id="eventform">
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label input-label">Название</p>
                        <input class ="input-block__input form-input" id="titleInput" value="{{title}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label input-label">Краткое описание</p>
                        <input class ="input-block__input form-input" id="descriptionInput" value="{{description}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label input-label">Описание</p>
                        <input class ="input-block__input form-input" id="textInput" value="{{text}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label input-label">Дата проведения</p>
                        <input class ="input-block__input form-input" id="dateInput" value="{{date}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label input-label">Город</p>
                        <input class ="input-block__input form-input" id="cityInput" value="{{city}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label input-label">Адрес</p>
                        <input class ="input-block__input form-input" id="geoInput" value="{{geo}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label input-label">Категория</p>
                        <input class ="input-block__input form-input" id="categoryInput" value="{{category}}"/>
                    </div>
                    <div class="eventform__input-block input-block">
                        <p class="input-block__input-label input-label">Теги</p>
                        <input class ="input-block__input form-input" id="tagInput" value="{{tag}}"/>
                    </div>
                    <div class="eventform__buttons buttons">
                        <input type="submit" value="ИЗМЕНИТЬ" class="buttons__button-submit button-submit">
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

        const event: EventData = {title, description, text, date, city, geo, category, tag};

        Bus.emit(Events.EventEditReq, event);
    }

    disable() {
        this.#removeListeners();

        this.#parent.innerHTML = '';
    }
}
