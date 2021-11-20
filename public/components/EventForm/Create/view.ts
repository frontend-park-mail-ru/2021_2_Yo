import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as template from '@event-create/create.hbs';
import * as tagTemplate from '@templates/tag/tag.hbs';
import '@templates/tag/tag.css';
import '@event-form/EventForm.css';
import Calendar from '@calendar/calendar';
import MapPopUp from '@map/map';
import config from '@/config';
import {InputData} from '@/types';

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
    #inputsData = new Map<string, InputData>();
    #calendar?: Calendar;
    #map?: MapPopUp;

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
        this.#parent.innerHTML = template(config);
        this.#addListeners();
        this.#eventTags = [];
    }

    #addListeners() {
        const form = <HTMLFormElement>document.getElementById('eventform');
        form.addEventListener('submit', this.#createEvent.bind(this));

        const tagButton = <HTMLInputElement>document.getElementById('tagButton');
        tagButton.addEventListener('click', this.#addTag.bind(this));

        const cancelButton = <HTMLInputElement>document.getElementById('cancel-button');
        cancelButton.addEventListener('click', () => Bus.emit(Events.RouteBack));

        const calendarButton = <HTMLElement>document.getElementById('calendarButton');
        calendarButton.addEventListener('click', this.#renderCalendar.bind(this));

        const tagInput = <HTMLElement>document.getElementById('tagInput');
        tagInput.addEventListener('keydown', this.#handleTagKeydown.bind(this));

        const geoButton = <HTMLElement>document.getElementById('geoButton');
        geoButton.addEventListener('click', this.#renderMap);

        this.#setInputs();
        this.#inputs.forEach((input) => {
            input.addEventListener('oninput')
        })
    }

    #removeListeners() {
        const form = <HTMLFormElement>document.getElementById('eventform');
        if (form) {
            form.removeEventListener('submit', this.#createEvent.bind(this));
        }

        const tagButton = <HTMLInputElement>document.getElementById('tagButton');
        if (tagButton) {
            tagButton.removeEventListener('click', this.#addTag.bind(this));
        }

        const cancelButton = <HTMLInputElement>document.getElementById('cancel-button');
        if (cancelButton) {
            cancelButton.removeEventListener('click', () => Bus.emit(Events.RouteBack));
        }

        this.#eventTags.map((t) => {
            const tag = <HTMLElement>document.getElementById('tag-' + t);
            if (!tag) return;

            tag.removeEventListener('click', this.#deleteTag);
        });

        const calendarButton = <HTMLElement>document.getElementById('calendarButton');
        if (calendarButton) {
            calendarButton.removeEventListener('click', this.#renderCalendar.bind(this));
        }

        const tagInput = <HTMLElement>document.getElementById('tagInput');
        if (tagInput) {
            tagInput.removeEventListener('keydown', this.#handleTagKeydown.bind(this));
        }

        const geoButton = <HTMLElement>document.getElementById('geoButton');
        if (geoButton) {
            geoButton.removeEventListener('click', this.#renderMap);
        }
    }

    #handleInputChange = (e: Event) => {
        e.preventDefault();


    }

    #renderMap = (e: Event) => {
        e.preventDefault();

        const map = new MapPopUp(this.#parent);
        // map.render();
    };

    #deleteTag = (e: MouseEvent) => {
        const target = <HTMLElement>e.target;
        const tagWrapper = <HTMLElement>e.currentTarget;

        if (!target || !tagWrapper || !target.dataset['tag'])
            return;

        this.#eventTags = this.#eventTags.filter(tag => tag !== target.dataset['tag']);

        tagWrapper.removeEventListener('click', this.#deleteTag);
        tagWrapper.outerHTML = '';
    };

    #rerenderTags() {
        this.#eventTags.map(tag => {
            const tagWrapper = <HTMLElement>document.getElementById('tag-' + tag);
            if (tagWrapper) tagWrapper.removeEventListener('click', this.#deleteTag);
        });

        const tagBlock = <HTMLElement>document.getElementById('tagBlock');
        tagBlock.innerHTML = '';
        this.#eventTags.map(tag => {
            tagBlock.innerHTML += tagTemplate(tag);
        });

        this.#eventTags.map(tag => {
            const tagWrapper = <HTMLElement>document.getElementById('tag-' + tag);
            if (tagWrapper) tagWrapper.addEventListener('click', this.#deleteTag);
        });
    }

    #handleTagKeydown(e: KeyboardEvent) {
        if (e.code !== 'Enter') return;
        e.preventDefault();
        this.#addTag();
    }

    #renderCalendar() {
        const calendarBlock = <HTMLInputElement>document.getElementById('calendar');

        if (!calendarBlock.innerHTML) {
            this.#calendar = new Calendar(calendarBlock);
            this.#calendar.render();
        }
    }

    #addTag(ev?: Event) {
        ev?.preventDefault();

        const tagBlock = <HTMLElement>document.getElementById('tagBlock');
        const tagInput = <HTMLInputElement>document.getElementById('tagInput');
        const tagError = <HTMLElement>document.getElementById('tagError');
        tagError.classList.remove('error_none');

        if (tagBlock.children.length === MAX_NUM_OF_TAGS) {
            tagError.textContent = TAGS_LIMIT_STR;
            return;
        }

        const tagTrimmed = tagInput.value.trim();
        if (tagTrimmed) {
            if (!tagTrimmed.match('^[a-zA-Zа-яА-Я0-9]+$')) {
                tagError.textContent = ONE_WORD_TAG_STR;
                return;
            }

            if (tagTrimmed.length > 30) {
                tagError.textContent = TAG_LENGTH_STR;
                return;
            }

            if (this.#eventTags.indexOf(tagTrimmed) === -1) {
                this.#eventTags.push(tagTrimmed);
                this.#rerenderTags();

                tagError.classList.add('error_none');
            } else {
                tagError.textContent = TAG_EXISTS_STR;
            }
        } else {
            tagError.textContent = NO_EMPTY_TAG_STR;
        }

        tagInput.value = '';
    }

    #createEvent(ev: Event) {
        ev.preventDefault();

        this.#setInputs();

        this.#inputsData.clear();
        this.#inputsData.set('title', {errors: [], value: <string>this.#inputs.get('title')?.value.trim()});
        this.#inputsData.set('description', {
            errors: [],
            value: <string>this.#inputs.get('description')?.value.trim()
        });
        this.#inputsData.set('text', {errors: [], value: <string>this.#inputs.get('text')?.value.trim()});
        this.#inputsData.set('date', {errors: [], value: <string>this.#inputs.get('date')?.value.trim()});
        this.#inputsData.set('city', {errors: [], value: <string>this.#inputs.get('city')?.value.trim()});
        this.#inputsData.set('geo', {errors: [], value: <string>this.#inputs.get('geo')?.value.trim()});
        this.#inputsData.set('category', {errors: [], value: <string>this.#inputs.get('category')?.value.trim()});
        this.#inputsData.set('tag', {errors: [], value: this.#eventTags});
        this.#inputsData.set('image', {errors: [], value: ''});

        let file: undefined | File;
        const imageInput = <HTMLInputElement>document.getElementById('imageInput');
        if (imageInput.files) file = imageInput.files[0];

        Bus.emit(Events.EventCreateReq, {input: this.#inputsData, file});
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
        const geoInput = <HTMLInputElement>document.getElementById('geoInput');
        this.#inputs.set('geo', geoInput);
        const categoryInput = <HTMLInputElement>document.getElementById('categoryInput');
        this.#inputs.set('category', categoryInput);
        const imageInput = <HTMLInputElement>document.getElementById('imageInput');
        this.#inputs.set('image', imageInput);
    }

    #showValidationErrors() {
        this.#inputs.forEach((input, key) => {
            const inputError = <HTMLElement>document.getElementById(key + 'Error');
            console.log(inputError);
            inputError.classList.add('error_none');
            const inputData = <InputData>this.#inputsData.get(key);

            inputData.errors.forEach(error => {
                if (error) {
                    inputError.classList.remove('error_none');
                    inputError.textContent = error;
                } else {
                    inputData.errors = inputData.errors.slice(1);
                }
            });
        });
    }

    #showCorrectInputs() {
        this.#inputs.forEach((input, key) => {
            if (!this.#inputsData.get(key)?.errors.length) {
                const inputError = <HTMLElement>document.getElementById(key + 'Error');
                inputError.classList.add('error_none');

                input.classList.add('form-input_correct');
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
