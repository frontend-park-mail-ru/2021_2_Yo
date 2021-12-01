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

        const nameInput = document.getElementById('nameInput') as HTMLInputElement;
        this.#inputs.set('name', nameInput);
        const surnameInput = document.getElementById('surnameInput') as HTMLInputElement;
        this.#inputs.set('surname', surnameInput);
        const emailInput = document.getElementById('emailInput') as HTMLInputElement;
        this.#inputs.set('email', emailInput);
        const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement;
        this.#inputs.set('password1', passwordInput1);
        const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement;
        this.#inputs.set('password2', passwordInput2);

        this.#addListeners();
    }

    #addListeners() {
        const form = document.getElementById('regForm') as HTMLFormElement;
        form.addEventListener('submit', this.#signup.bind(this));

        const back = <HTMLElement>document.getElementById('back');
        back.addEventListener('click', this.#back);

        this.#inputs.forEach((input, key) => {
            input.addEventListener('input', this.#handleInputChange.bind(this, input, key));
        });
    }

    #removeListeners() {
        const form = document.getElementById('regForm') as HTMLFormElement;
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

        const errorsBlock = document.getElementById('errors') as HTMLParagraphElement;
        errorsBlock.innerHTML = '';

        this.#inputsData.clear();
        this.#inputsData.set('name', {errors: [], value: this.#inputs.get('name')?.value.trim() as string});
        this.#inputsData.set('surname', {errors: [], value: this.#inputs.get('surname')?.value.trim() as string});
        this.#inputsData.set('email', {errors: [], value: this.#inputs.get('email')?.value.trim() as string});
        this.#inputsData.set('password1', {errors: [], value: this.#inputs.get('password1')?.value.trim() as string});
        this.#inputsData.set('password2', {errors: [], value: this.#inputs.get('password2')?.value.trim() as string});

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
        const errorsBlock = document.getElementById('errors') as HTMLParagraphElement;
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
