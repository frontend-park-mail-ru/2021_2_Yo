import {UrlPathnames} from '../../../types.js';
import route from '../../../modules/routing.js';
import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

const CHILD_NUM = 2;

export default class SignupView {
    #parent: HTMLElement;
    #inputs = new Map<string, HTMLInputElement>();
    #inputsData = new Map<string, { errors: string[], value: string }>();

    constructor(parent: HTMLElement) {
        this.#parent = parent;

        bus.on(Events.UserAuthorized, this.#routingHandle);
        bus.on(Events.AuthError, this.#validationHandle);
        bus.on(Events.ValidationError, this.#validationHandle);
        bus.on(Events.ValidationOk, this.#validationHandle);
    }

    #validationHandle = ((error: string) => {
        this.#showValidationErrors();
        this.#showCorrectInputs();
        if (error) {
            this.#showServerErrors(error);
        }
    }).bind(this);

    #routingHandle = (() => {
        this.#redirect();
    }).bind(this);

    render() {
        const source = `
            <div class = "background">
                <img class="background__logo" src="./img/logo.png">
                <div class = "authform">
                    <p class="authform__label label">Регистрация</p>
                    <form id="regForm">
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Имя</p>
                            <input class ="input-block__input form-input" id="nameInput">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Фамилия</p>
                            <input class ="input-block__input form-input" id="surnameInput">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Email</p>
                            <input class ="input-block__input form-input" id="emailInput">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Пароль</p>
                            <input class ="input-block__input form-input" type="password" id="passwordInput1">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Пароль еще раз</p>
                            <input class ="input-block__input form-input" type="password" id="passwordInput2">
                        </div>
                        <p class="authform__error error" id="errors"></p>
                        <div class="authform__buttons buttons">
                            <input type="submit" value="ЗАРЕГИСТРИРОВАТЬСЯ" class="buttons__button-submit button-submit">
                            <a class="buttons__button-back button-back">НАЗАД</a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template();

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
    }

    #removeListeners() {
        const form = document.getElementById('regForm') as HTMLFormElement;
        form.removeEventListener('submit', this.#signup.bind(this));
    }

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

        bus.emit(Events.SubmitLogin, this.#inputsData);
    }

    #redirect() {
        void route(UrlPathnames.Main);
    }

    #showValidationErrors() {
        this.#inputsData.forEach((item, key) => {
            const input = this.#inputs.get(key) as HTMLElement;
            const par = input.parentElement as HTMLElement;
            item.errors.forEach(error => {
                if (error) {
                    input.classList.add('form-input_error');
                    par.classList.add('input-block_error');
                    if (par.innerHTML.indexOf(error) === -1) {
                        const p = document.createElement('p');
                        p.classList.add('input-block__error');
                        p.classList.add('error');
                        p.textContent = error;
                        par.appendChild(p);
                    }
                } else {
                    item.errors = item.errors.slice(1);
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
                const par = input.parentElement as HTMLElement;
                par.classList.remove('input-block_error');
                input.classList.remove('form-input_error');
                input.classList.add('form-input_correct');
                while (par.children.length !== CHILD_NUM) {
                    par.removeChild(par.lastChild as ChildNode);
                }
            }
        });
    }

    disable() {
        this.#removeListeners();

        bus.off(Events.UserAuthorized, this.#routingHandle);
        bus.off(Events.AuthError, this.#validationHandle);
        bus.off(Events.ValidationError, this.#validationHandle);
        bus.off(Events.ValidationOk, this.#validationHandle);
    }
}
