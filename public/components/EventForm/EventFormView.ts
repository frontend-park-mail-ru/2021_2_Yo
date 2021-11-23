import {EventData, InputData} from '@/types';
import Calendar from '@calendar/calendar';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import MapPopUp from '@map/map';
import * as tagTemplate from '@templates/tag/tag.hbs';

const MAX_NUM_OF_TAGS = 6;
const TAGS_LIMIT_STR = 'К одному мероприятию можно добавить не больше шести тегов';
const ONE_WORD_TAG_STR = 'Тег должен состоять из одного слова';
const NO_EMPTY_TAG_STR = 'Невозможно добавить пустой тег';
const TAG_EXISTS_STR = 'Тег уже добавлен';
const TAG_LENGTH_STR = 'Слишком много символов. Максимальная длина 30 символов';

export abstract class EventFormView {
    protected parent: HTMLElement;
    protected eventTags: string[] = [];
    protected inputs = new Map<string, HTMLInputElement>();
    protected inputsData = new Map<string, InputData>();
    protected calendar?: Calendar;
    protected event?: EventData;

    abstract render(): void;

    abstract disable(): void;

    constructor(parent: HTMLElement) {
        this.parent = parent;
    }

    subscribe() {
        Bus.on(Events.ValidationError, this.validationHandle);
        Bus.on(Events.ValidationOk, this.validationHandle);
    }

    protected validationHandle = (() => {
        this.#showValidationErrors();
        this.#showCorrectInputs();
    }).bind(this);

    protected handleInputChange(input: HTMLInputElement, key: string) {
        input.classList.remove('form-input_correct');
        input.classList.remove('form-input_error');
        const inputError = <HTMLElement>document.getElementById(key + 'Error');
        inputError.classList.add('error_none');

        if (input.value.trim()) {
            input.classList.add('form-input_changed');
        } else {
            input.classList.remove('form-input_changed');
        }
    }

    protected renderMap = (e: Event) => {
        e.preventDefault();

        const mapContainer = <HTMLElement>document.getElementById('map');
        const map = new MapPopUp(mapContainer);
        map.render(this.event);
    };

    deleteTag = (e: MouseEvent) => {
        const target = <HTMLElement>e.target;
        const tagWrapper = <HTMLElement>e.currentTarget;

        if (!target || !tagWrapper || !target.dataset['tag'])
            return;

        this.eventTags = this.eventTags.filter(tag => tag !== target.dataset['tag']);

        tagWrapper.removeEventListener('click', this.deleteTag);
        tagWrapper.outerHTML = '';
    };

    #rerenderTags() {
        this.eventTags.map(tag => {
            const tagWrapper = <HTMLElement>document.getElementById('tag-' + tag);
            if (tagWrapper) tagWrapper.removeEventListener('click', this.deleteTag);
        });

        const tagBlock = <HTMLElement>document.getElementById('tagBlock');
        tagBlock.innerHTML = '';
        this.eventTags.map(tag => {
            tagBlock.innerHTML += tagTemplate(tag);
        });

        this.eventTags.map(tag => {
            const tagWrapper = <HTMLElement>document.getElementById('tag-' + tag);
            if (tagWrapper) tagWrapper.addEventListener('click', this.deleteTag);
        });
    }

    protected handleTagKeydown(e: KeyboardEvent) {
        if (e.code !== 'Enter') return;
        e.preventDefault();
        this.addTag();
    }

    protected renderCalendar() {
        const calendarBlock = <HTMLInputElement>document.getElementById('calendarBlock');

        if (!calendarBlock.innerHTML) {
            this.calendar = new Calendar(calendarBlock);
            this.calendar.render();
        }
    }

    protected addTag(ev?: Event) {
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
                tagInput.classList.add('form-input_error');
                return;
            }

            if (tagTrimmed.length > 30) {
                tagError.textContent = TAG_LENGTH_STR;
                tagInput.classList.add('form-input_error');
                return;
            }

            if (this.eventTags.indexOf(tagTrimmed) === -1) {
                this.eventTags.push(tagTrimmed);
                this.#rerenderTags();

                tagInput.classList.remove('form-input_error');
                tagError.classList.add('error_none');
            } else {
                tagInput.classList.add('form-input_error');
                tagError.textContent = TAG_EXISTS_STR;
            }
        } else {
            tagInput.classList.add('form-input_error');
            tagError.textContent = NO_EMPTY_TAG_STR;
        }

        tagInput.classList.remove('form-input_changed');
        tagInput.value = '';
    }

    protected setInputs() {
        const titleInput = <HTMLInputElement>document.getElementById('titleInput');
        this.inputs.set('title', titleInput);
        const descriptionInput = <HTMLInputElement>document.getElementById('descriptionInput');
        this.inputs.set('description', descriptionInput);
        const textInput = <HTMLInputElement>document.getElementById('textInput');
        this.inputs.set('text', textInput);
        const dateInput = <HTMLInputElement>document.getElementById('dateInput');
        this.inputs.set('date', dateInput);
        const geoInput = <HTMLInputElement>document.getElementById('geoInput');
        this.inputs.set('geo', geoInput);
        const tagInput = <HTMLInputElement>document.getElementById('tagInput');
        this.inputs.set('tag', tagInput);
        const categoryInput = <HTMLInputElement>document.getElementById('categoryInput');
        this.inputs.set('category', categoryInput);
        const imageInput = <HTMLInputElement>document.getElementById('imageInput');
        this.inputs.set('image', imageInput);
    }

    #showValidationErrors() {
        this.inputs.forEach((input, key) => {
            const inputError = <HTMLElement>document.getElementById(key + 'Error');
            inputError.classList.add('error_none');
            const inputData = <InputData>this.inputsData.get(key);

            inputData.errors.forEach(error => {
                if (error) {
                    if (key != 'geo')
                        input.classList.add('form-input_error');
                    inputError.classList.remove('error_none');
                    inputError.textContent = error;
                } else {
                    inputData.errors = inputData.errors.slice(1);
                }
            });
        });
    }

    #showCorrectInputs() {
        this.inputs.forEach((input, key) => {
            if (!this.inputsData.get(key)?.errors.length) {
                const inputError = <HTMLElement>document.getElementById(key + 'Error');
                inputError.classList.add('error_none');

                input.classList.add('form-input_correct');
            }
        });
    }
}
