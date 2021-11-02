import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as errorTemplate from '@event-form/error.hbs';
import * as template from '@event-create/eventcreate.hbs';
import '@event-form/EventForm.css';

const MAX_NUM_OF_TAGS = 6;
const TAGS_LIMIT_STR = 'К одному мероприятию можно добавить не больше шести тегов';
const ONE_WORD_TAG_STR = 'Тег должен состоять из одного слова';
const NO_EMPTY_TAG_STR = 'Невозможно добавить пустой тег';
const TAG_EXISTS_STR = 'Тег уже добавлен';
const TAG_LENGTH_STR = 'Слишком много символов. Максимальная длина 30 символов';

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

    renderError() {
        // const template = window.Handlebars.compile('<p>Ниче нету, ничего нельзя, залогинься</p>');
        this.#parent.innerHTML = errorTemplate();
    }

    render() {
        this.#parent.innerHTML = template();

        this.#setInputs();
        this.#addListeners();
    }

    #setInputs() {
        const titleInput = <HTMLInputElement>document.getElementById('titleInput');
        this.#inputs.set('title', titleInput);
        const descriptionInput = <HTMLInputElement>document.getElementById('descriptionInput');
        this.#inputs.set('description', descriptionInput);
        const textInput = <HTMLInputElement>document.getElementById('textInput');
        this.#inputs.set('text', textInput);
        const dateInput = <HTMLInputElement>document.getElementById('dateInput');
        this.#inputs.set('date', dateInput);
        const cityInput = <HTMLInputElement>document.getElementById('cityInput');
        this.#inputs.set('city', cityInput);
        const geoInput = <HTMLInputElement>document.getElementById('geoInput');
        this.#inputs.set('geo', geoInput);
        const categoryInput = <HTMLInputElement>document.getElementById('categoryInput');
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
        if (form) {
            form.removeEventListener('submit', this.#createEvent.bind(this));
        }

        const tagButton = document.getElementById('tagButton') as HTMLInputElement;
        if (tagButton) {
            tagButton.removeEventListener('click', this.#addTag.bind(this));
        }
    }

    #addTag(ev: Event) {
        ev.preventDefault();

        const tagBlock = document.getElementById('tagBlock') as HTMLElement;
        const tagInput = document.getElementById('tagInput') as HTMLInputElement;
        const tagBlockError = document.getElementById('tagBlockError') as HTMLElement;
        const errorP = tagBlockError.firstElementChild as HTMLElement;
        errorP.classList.remove('error_none');

        if (tagBlock.children.length === MAX_NUM_OF_TAGS) {
            errorP.textContent = TAGS_LIMIT_STR;
            return;
        }

        if (tagInput.value.trim()) {
            if (!tagInput.value.trim().match('^[a-zA-Zа-яА-Я0-9]+$')) {
                errorP.textContent = ONE_WORD_TAG_STR;
                return;
            }

            if (tagInput.value.trim().length > 30) {
                errorP.textContent = TAG_LENGTH_STR;
                return;
            }
            if (this.#eventTags.indexOf(tagInput.value.trim()) === -1) {
                const tag = document.createElement('a');
                tag.classList.add('event-tag');
                tag.textContent = tagInput.value.trim();
                tagBlock.appendChild(tag);
                this.#eventTags.push(tagInput.value.trim());

                errorP.classList.add('error_none');
            } else {
                errorP.textContent = TAG_EXISTS_STR;
            }
        } else {
            errorP.textContent = NO_EMPTY_TAG_STR;
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
            const inputBlock = input.parentElement as HTMLElement;
            const errorP = inputBlock.lastElementChild as HTMLElement;
            const inputData = this.#inputsData.get(key) as { errors: string[], value: string };

            inputData.errors.forEach(error => {
                if (error) {
                    inputBlock.classList.add('input-block_error');

                    if (inputBlock.innerHTML.indexOf(error) === -1) {
                        errorP.classList.remove('error_none');
                        errorP.textContent = error;
                    }
                } else {
                    inputData.errors = inputData.errors.slice(1);
                }
            });
        });
    }

    #showCorrectInputs() {
        this.#inputs.forEach((input, key) => {
            if (!this.#inputsData.get(key)?.errors.length) {
                const inputBlock = input.parentElement as HTMLElement;
                inputBlock.classList.remove('input-block_error');

                const errorP = inputBlock.lastElementChild as HTMLElement;
                errorP.textContent = '';
                errorP.classList.add('error_none');
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
