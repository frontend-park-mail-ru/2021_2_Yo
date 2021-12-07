import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import * as template from '@signup/signup.hbs';
import '@authorization/Authorization.css';
import {InputData} from '@/types';

const CHILD_NUM = 2;

export default class SignupView {
    #parent: HTMLElement;
    #inputs = new Map<string, HTMLInputElement>();
    #inputsData = new Map<string, { errors: string[], value: string }>();

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.AuthError, this.#validationHandle);
        Bus.on(Events.ValidationError, this.#validationHandle);
        Bus.on(Events.ValidationOk, this.#validationHandle);
    }

    #validationHandle = ((error: string) => {
        this.#showValidationErrors();
        this.#showCorrectInputs();
        if (error) {
            this.#showServerErrors(error);
        }
    }).bind(this);

    render() {
        this.#parent.innerHTML = template();

        const nameInput = <HTMLInputElement>document.getElementById('nameInput');
        this.#inputs.set('name', nameInput);
        const surnameInput = <HTMLInputElement>document.getElementById('surnameInput');
        this.#inputs.set('surname', surnameInput);
        const emailInput = <HTMLInputElement>document.getElementById('emailInput');
        this.#inputs.set('email', emailInput);
        const passwordInput1 = <HTMLInputElement>document.getElementById('passwordInput1');
        this.#inputs.set('password1', passwordInput1);
        const passwordInput2 = <HTMLInputElement>document.getElementById('passwordInput2');
        this.#inputs.set('password2', passwordInput2);

        this.#addListeners();
    }

    #addListeners() {
        const form = <HTMLFormElement>document.getElementById('regForm');
        form.addEventListener('submit', this.#signup.bind(this));

        const back = <HTMLElement>document.getElementById('back');
        back.addEventListener('click', this.#back);

        this.#inputs.forEach((input, key) => {
            input.addEventListener('input', this.#handleInputChange.bind(this, input, key));
        });
    }

    #removeListeners() {
        const form = <HTMLFormElement>document.getElementById('regForm');
        form.removeEventListener('submit', this.#signup.bind(this));

        const back = <HTMLElement>document.getElementById('back');
        back.addEventListener('click', this.#back);

        this.#inputs.forEach((input, key) => {
            if (input) {
                input.removeEventListener('input', this.#handleInputChange.bind(this, input, key));
            }
        });
    }

    #back = (event: MouseEvent) => {
        event.preventDefault();
        Bus.emit(Events.RouteBack);
        event.stopPropagation();
    };

    #signup(event: Event) {
        event.preventDefault();

        const errorsBlock = <HTMLParagraphElement>document.getElementById('errors');
        errorsBlock.innerHTML = '';

        this.#inputsData.clear();
        this.#inputsData.set('name', {errors: [], value: <string>this.#inputs.get('name')?.value.trim()});
        this.#inputsData.set('surname', {errors: [], value: <string>this.#inputs.get('surname')?.value.trim()});
        this.#inputsData.set('email', {errors: [], value: <string>this.#inputs.get('email')?.value.trim()});
        this.#inputsData.set('password1', {errors: [], value: <string>this.#inputs.get('password1')?.value.trim()});
        this.#inputsData.set('password2', {errors: [], value: <string>this.#inputs.get('password2')?.value.trim()});

        Bus.emit(Events.SubmitLogin, this.#inputsData);
    }

    #showValidationErrors() {
        this.#inputs.forEach((input, key) => {
            const inputError = <HTMLElement>document.getElementById(key + 'Error');
            inputError.classList.add('error_none');
            const inputData = <InputData>this.#inputsData.get(key);

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

    #showServerErrors(error: string) {
        const errorsBlock = <HTMLParagraphElement>document.getElementById('errors');
        errorsBlock.textContent = error;
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

        this.#parent.innerHTML = '';

        Bus.off(Events.AuthError, this.#validationHandle);
        Bus.off(Events.ValidationError, this.#validationHandle);
        Bus.off(Events.ValidationOk, this.#validationHandle);
    }

    #handleInputChange(input: HTMLInputElement, key: string) {
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
}
