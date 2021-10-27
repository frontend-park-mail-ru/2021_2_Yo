import {EventData} from '../../../types.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

const CHILD_NUM = 2;

export default class EventFormView {
    #parent: HTMLElement;
    #eventTags: string[] = [];
    #inputs = new Map<string, HTMLInputElement>();
    #inputsData = new Map<string, { errors: string[], value: string | string[] }>();

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.ValidationError, this.#validationHandle);
        Bus.on(Events.ValidationOk, this.#validationHandle);
    }

    #validationHandle = (() => {
        this.#showValidationErrors();
        this.#showCorrectInputs();
    }).bind(this);

    render() {
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
                            <input class ="input-block__input form-input form-input_thin" id="dateInput" type="date"/>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Город</p>
                            <input class ="input-block__input form-input form-input_thin" id="cityInput"/>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Адрес</p>
                            <input class ="input-block__input form-input form-input_thin" id="geoInput"/>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Категория</p>
                            <input class ="input-block__input form-input form-input_thin" id="categoryInput"/>
                        </div>
                        <div class="eventform__input-block input-block">
                            <p class="input-block__input-label event-text">Теги</p>
                            <input class ="input-block__input form-input form-input_thin" id="tagInput">
                            <input value="Добавить" id="tagButton" class="input-block__input button-cancel" 
                            type="button">
                            <div id="tagBlockError"></div>
                            <div class="event-tags-block" id="tagBlock"></div>
                        </div>
                        <div class="eventform__buttons buttons">
                            <input type="button" value="Отмена" class="button-cancel">
                            <input type="submit" value="СОЗДАТЬ" class="button-save">
                        </div>
                    </form>
                </div>
        `;

        const template: any = window.Handlebars.compile(source);
        this.#parent.innerHTML = template();

        this.#setInputs();
        this.#addListeners();
    }

    #setInputs() {
        const titleInput = document.getElementById('titleInput') as HTMLInputElement;
        this.#inputs.set('title', titleInput);
        const descriptionInput = document.getElementById('descriptionInput') as HTMLInputElement;
        this.#inputs.set('description', descriptionInput);
        const textInput = document.getElementById('textInput') as HTMLInputElement;
        this.#inputs.set('text', textInput);
        const dateInput = document.getElementById('dateInput') as HTMLInputElement;
        this.#inputs.set('date', dateInput);
        const cityInput = document.getElementById('cityInput') as HTMLInputElement;
        this.#inputs.set('city', cityInput);
        const geoInput = document.getElementById('geoInput') as HTMLInputElement;
        this.#inputs.set('geo', geoInput);
        const categoryInput = document.getElementById('categoryInput') as HTMLInputElement;
        this.#inputs.set('category', categoryInput);
    }

    #addListeners() {
        const form = document.getElementById('eventform') as HTMLFormElement;
        form.addEventListener('submit', this.#createEvent.bind(this));

        const tagButton = document.getElementById('tagButton') as HTMLInputElement;
        tagButton.addEventListener('click', this.#addTag.bind(this));
    }

    #removeListeners() {
        const form = document.getElementById('eventform') as HTMLFormElement;
        form.removeEventListener('submit', this.#createEvent.bind(this));

        const tagButton = document.getElementById('tagButton') as HTMLInputElement;
        tagButton.removeEventListener('click', this.#addTag.bind(this));
    }

    #addTag(ev: Event) {
        ev.preventDefault();

        const tagBlock = document.getElementById('tagBlock') as HTMLElement;
        const tagBlockError = document.getElementById('tagBlockError') as HTMLElement;
        const tagInput = document.getElementById('tagInput') as HTMLInputElement;

        while (tagBlockError.children.length) {
            tagBlockError.removeChild(tagBlockError.lastChild as ChildNode);
        }

        const errorP = document.createElement('p');
        errorP.classList.add('input-block__error');
        errorP.classList.add('error');

        if (tagBlock.children.length == 6) {
            errorP.textContent = 'К одному мероприятию можно добавить не больше шести тегов';
            tagBlockError.appendChild(errorP);
            return;
        }

        if (tagInput.value.trim()) {
            if (!tagInput.value.trim().match('^[a-zA-Zа-яА-Я]+$')) {
                errorP.textContent = 'Тег должен состоять из одного слова';
                tagBlockError.appendChild(errorP);
            } else if (this.#eventTags.indexOf(tagInput.value.trim()) === -1) {
                const tag = document.createElement('a');
                tag.classList.add('event-tag');
                tag.textContent = tagInput.value.trim();
                tagBlock.appendChild(tag);

                this.#eventTags.push(tagInput.value.trim());
            }
        } else {
            errorP.textContent = 'Невозможно добавить пустой тег';
            tagBlockError.appendChild(errorP);
        }

        tagInput.value = '';
    }

    #createEvent(ev: Event) {
        ev.preventDefault();

        this.#inputsData.set('title', {errors: [], value: this.#inputs.get('title')?.value.trim() as string});
        this.#inputsData.set('description', {
            errors: [],
            value: this.#inputs.get('description')?.value.trim() as string
        });
        this.#inputsData.set('text', {errors: [], value: this.#inputs.get('text')?.value.trim() as string});
        this.#inputsData.set('date', {errors: [], value: this.#inputs.get('date')?.value.trim() as string});
        this.#inputsData.set('city', {errors: [], value: this.#inputs.get('city')?.value.trim() as string});
        this.#inputsData.set('geo', {errors: [], value: this.#inputs.get('geo')?.value.trim() as string});
        this.#inputsData.set('category', {errors: [], value: this.#inputs.get('category')?.value.trim() as string});
        this.#inputsData.set('tag', {errors: [], value: this.#eventTags});

        Bus.emit(Events.EventCreateReq, this.#inputsData);
    }

    #showValidationErrors() {
        this.#inputs.forEach((input, key) => {
            const par = input.parentElement as HTMLElement;

            this.#inputsData.get(key)?.errors.forEach(error => {
                if (error) {
                    par.classList.add('input-block_error');

                    if (par.innerHTML.indexOf(error) === -1) {
                        const p = document.createElement('p');
                        p.classList.add('input-block__error');
                        p.classList.add('error');
                        p.textContent = error;
                        par.appendChild(p);
                    }
                } else {
                    this.#inputsData.get(key)!.errors = this.#inputsData.get(key)?.errors.slice(1) as string[];
                }
            });
        });
    }

    #showCorrectInputs() {
        this.#inputs.forEach((input, key) => {
            if (!this.#inputsData.get(key)?.errors.length) {
                const par = input.parentElement as HTMLElement;
                par.classList.remove('input-block_error');

                while (par.children.length !== CHILD_NUM) {
                    par.removeChild(par.lastChild as ChildNode);
                }
            }
        });
    }

    disable() {
        this.#removeListeners();
        Bus.off(Events.ValidationError, this.#validationHandle);
        Bus.off(Events.ValidationOk, this.#validationHandle);
        this.#parent.innerHTML = '';
    }
}
