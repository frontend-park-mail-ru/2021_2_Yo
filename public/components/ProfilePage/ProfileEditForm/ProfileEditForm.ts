import {UserData} from '../../../types.js';
import Events from '../../../modules/eventbus/events.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import UserStore from '../../../modules/userstore.js';

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
                    <p class="profile-input-label">Фото профиля</p>
                    <input class="profile-form-input" id="avatarInput" type="file"/>
                    <p class="error error_none input-block__error"></p>
                </div>
                <button class="button-save profile-block__button-save" type="submit">
                    Подтвердить
                </button>
            </form>
            <form id="passwordForm">
                <div class="input-block">
                    <p class="profile-input-label">Пароль</p>
                    <input class="profile-form-input" id="passwordInput1" maxlength="50" type="password"/>
                    <p class="error error_none input-block__error"></p>
                </div>
                <div class="input-block">
                    <p class="profile-input-label">Подтвердить пароль</p>
                    <input class="profile-form-input" id="passwordInput2" maxlength="50" type="password"/>
                    <p class="error error_none input-block__error"></p>
                </div>
                <button class="button-save profile-block__button-save" type="submit">
                    Изменить пароль
                </button>
            </form>
            <button class="button-edit profile-block__button-edit" id="cancelButton">Отмена</button>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template(user);

        this.#addListeners();
    }

    disable() {
        Bus.off(Events.ValidationError, this.#validationHandle);
        Bus.off(Events.ValidationOk, this.#validationHandle);

        this.#removeListeners();
    }

    #addListeners() {
        const form = document.getElementById('form') as HTMLFormElement;
        form.addEventListener('submit', this.#mainFormSubmitHandle);

        const passwordForm = document.getElementById('passwordForm') as HTMLFormElement;
        passwordForm.addEventListener('submit', this.#passwordFormSubmitHandle);

        const cancelButton = document.getElementById('cancelButton') as HTMLInputElement;
        cancelButton.addEventListener('click', this.#cancelEdit);
    }

    #cancelEdit = ((ev: Event) => {
        ev.preventDefault();

        Bus.emit(Events.UserEditRes, UserStore.get());
    });

    #removeListeners() {
        const form = document.getElementById('form') as HTMLFormElement;
        form.removeEventListener('submit', this.#mainFormSubmitHandle);

        const passwordForm = document.getElementById('passwordForm') as HTMLFormElement;
        passwordForm.removeEventListener('submit', this.#passwordFormSubmitHandle);
    }

    #passwordFormSubmitHandle = ((ev: Event) => {
        ev.preventDefault();

        const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement;
        this.#inputs.set('password1', passwordInput1);
        this.#inputsData.set('password1', {errors: [], value: passwordInput1.value.trim()});

        const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement;
        this.#inputs.set('password2', passwordInput2);
        this.#inputsData.set('password2', {errors: [], value: passwordInput2.value.trim()});

        Bus.emit(Events.UserPasswordEditReq, this.#inputsData);
    });

    #mainFormSubmitHandle = ((ev: Event) => {
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

        Bus.emit(Events.UserEditReq, this.#inputsData);
    });

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

}
