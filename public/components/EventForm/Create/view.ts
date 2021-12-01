import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import {EventFormView} from '@event-form/EventFormView';
import * as template from '@event-form/templates/eventform.hbs';
import config from '@/config';

export default class EventCreateView extends EventFormView {
    render() {
        this.parent.innerHTML = template(config);
        this.addListeners();
        this.eventTags = [];
    }

    disable() {
        this.#removeListeners();
        Bus.off(Events.ValidationError, this.validationHandle);
        Bus.off(Events.ValidationOk, this.validationHandle);
        this.parent.innerHTML = '';
    }

    addListeners() {
        const form = <HTMLFormElement>document.getElementById('eventform');
        form.addEventListener('submit', this.#createEvent.bind(this));

        const tagButton = <HTMLInputElement>document.getElementById('tagButton');
        tagButton.addEventListener('click', this.addTag.bind(this));

        const cancelButton = <HTMLInputElement>document.getElementById('cancel-button');
        cancelButton.addEventListener('click', this.handleCancel.bind(this));

        const calendarButton = <HTMLElement>document.getElementById('calendarButton');
        calendarButton.addEventListener('click', this.renderCalendar.bind(this));

        const tagInput = <HTMLElement>document.getElementById('tagInput');
        tagInput.addEventListener('keydown', this.handleTagKeydown.bind(this));

        const geoButton = <HTMLElement>document.getElementById('geoInput');
        geoButton.addEventListener('click', this.renderMap);

        this.setInputs();
        this.inputs.forEach((input, key) => {
            input.addEventListener('input', this.handleInputChange.bind(this, input, key));
        });

        const imageInput = <HTMLInputElement>document.getElementById('imageInput');
        imageInput.addEventListener('change', this.showPhoto.bind(this, imageInput));

        const backButton = document.getElementById('backButton');
        backButton?.addEventListener('click', () => Bus.emit(Events.RouteBack));
    }

    #removeListeners() {
        const form = <HTMLFormElement>document.getElementById('eventform');
        if (form) {
            form.removeEventListener('submit', this.#createEvent.bind(this));
        }

        const tagButton = <HTMLInputElement>document.getElementById('tagButton');
        if (tagButton) {
            tagButton.removeEventListener('click', this.addTag.bind(this));
        }

        const cancelButton = <HTMLInputElement>document.getElementById('cancel-button');
        if (cancelButton) {
            cancelButton.removeEventListener('click', this.handleCancel.bind(this));
        }

        this.eventTags.map((t) => {
            const tag = <HTMLElement>document.getElementById('tag-cross-' + t);
            if (!tag) return;

            tag.removeEventListener('click', this.deleteTag);
        });

        const calendarButton = <HTMLElement>document.getElementById('calendarButton');
        if (calendarButton) {
            calendarButton.removeEventListener('click', this.renderCalendar.bind(this));
        }

        const tagInput = <HTMLElement>document.getElementById('tagInput');
        if (tagInput) {
            tagInput.removeEventListener('keydown', this.handleTagKeydown.bind(this));
        }

        const geoButton = <HTMLElement>document.getElementById('geoInput');
        if (geoButton) {
            geoButton.removeEventListener('click', this.renderMap);
        }

        this.inputs.forEach((input, key) => {
            if (input) {
                input.removeEventListener('input', this.handleInputChange.bind(this, input, key));
            }
        });

        const imageInput = <HTMLInputElement>document.getElementById('imageInput');
        if (imageInput) {
            imageInput.removeEventListener('change', this.showPhoto.bind(this, imageInput));
        }

        const photoLabel = <HTMLElement>document.getElementById('photo-label');
        if (photoLabel) {
            photoLabel.removeEventListener('click', this.deletePhoto.bind(this));
        }

        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.removeEventListener('click', () => Bus.emit(Events.RouteBack));
        }
    }

    #createEvent(ev: Event) {
        ev.preventDefault();

        this.setInputs();

        this.inputsData.clear();
        this.inputsData.set('title', {errors: [], value: <string>this.inputs.get('title')?.value.trim()});
        this.inputsData.set('description', {
            errors: [],
            value: <string>this.inputs.get('description')?.value.trim()
        });
        this.inputsData.set('text', {errors: [], value: <string>this.inputs.get('text')?.value.trim()});
        this.inputsData.set('date', {errors: [], value: <string>this.inputs.get('date')?.value.trim()});
        this.inputsData.set('geo', {errors: [], value: <string>this.inputs.get('geo')?.placeholder.trim()});
        this.inputsData.set('category', {errors: [], value: <string>this.inputs.get('category')?.value.trim()});
        this.inputsData.set('tag', {errors: [], value: this.eventTags});
        this.inputsData.set('image', {errors: [], value: ''});

        let file: undefined | File;
        const imageInput = <HTMLInputElement>document.getElementById('imageInput');
        if (imageInput.files) file = imageInput.files[0];

        Bus.emit(Events.EventCreateReq, {input: this.inputsData, file});
    }
}
