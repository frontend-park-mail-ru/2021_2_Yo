import {UserData} from '../../../types.js';
import Events from '../../../modules/eventbus/events.js';
import Bus from '../../../modules/eventbus/eventbus.js';

export default class ProfileEditForm {
    #parent: HTMLElement;
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

    render(user?: UserData) {
        const source = `
            <form id="form">
                <div class="input-block">
                    <p class="profile-input-label">Имя</p>
                    <input class="profile-form-input" id="nameInput" value="{{name}}" maxlength="50"/>
                    <p class="error error_none input-block__error"></p>
                </div>
                <div class="input-block">
                    <p class="profile-input-label">Фамилия</p>
                    <input class="profile-form-input" id="surnameInput" value="{{surname}}" maxlength="50"/>
                    <p class="error error_none input-block__error"></p>
                </div>
                <div class="input-block">
                    <p class="profile-input-label">О себе</p>
                    <textarea class="form-textarea" rows="4" id="selfDescriptionInput" maxlength="150">{{description}}</textarea>
                    <p class="error error_none input-block__error"></p>
                </div>
                <div class="input-block">
                    <p class="profile-input-label">Пароль</p>
                    <input class="profile-form-input" id="passwordInput1" maxlength="50"/>
                    <p class="error error_none input-block__error"></p>
                </div>
                <div class="input-block">
                    <p class="profile-input-label">Подтвердить пароль</p>
                    <input class="profile-form-input" id="passwordInput2" maxlength="50"/>
                    <p class="error error_none input-block__error"></p>
                </div>
            </form>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template(user);

        this.#addListeners();
    }

    disable() {
        this.#removeListeners();
    }

    #addListeners() {
        const form = document.getElementById('form') as HTMLFormElement;
        form.addEventListener('submit', this.#submitHandle);
    }

    #removeListeners() {
        const form = document.getElementById('form') as HTMLFormElement;
        form.addEventListener('submit', this.#submitHandle);
    }

    #back = (ev: MouseEvent) => {
        ev.preventDefault();
        Bus.emit(Events.RouteBack);
        ev.stopPropagation();
    };

    #submitHandle = ((ev: Event) => {
        ev.preventDefault();

        const nameInput = document.getElementById('nameInput') as HTMLInputElement;
        this.#inputs.set('name', nameInput);
        this.#inputsData.set('name', {errors: [], value: nameInput.value.trim()});

        const surnameInput = document.getElementById('surnameInput') as HTMLInputElement;
        this.#inputs.set('surname', surnameInput);
        this.#inputsData.set('surname', {errors: [], value: surnameInput.value.trim()});

        const selfDescriptionInput = document.getElementById('selfDescriptionInput') as HTMLInputElement;
        this.#inputs.set('selfDescription', selfDescriptionInput);
        this.#inputsData.set('selfDescription', {errors: [], value: selfDescriptionInput.value.trim()});

        const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement;
        this.#inputs.set('password1', passwordInput1);
        this.#inputsData.set('password1', {errors: [], value: passwordInput1.value.trim()});

        const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement;
        this.#inputs.set('password2', passwordInput2);
        this.#inputsData.set('password2', {errors: [], value: passwordInput2.value.trim()});

        Bus.emit(Events.UserEditReq, this.#inputsData);
    });

    #showValidationErrors() {
        console.log(this.#inputsData, this.#inputs);
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

}
