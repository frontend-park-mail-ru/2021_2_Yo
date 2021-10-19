import {UrlPathnames} from '../../../types.js';
import route from '../../../modules/routing.js';
import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class LoginView {
    #parent: HTMLElement;
    #inputs = new Map<string, HTMLInputElement>();
    #inputsData = new Map<string, { errors: string[], value: string }>();

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        bus.on(Events.UserLogin, this.#redirect.bind(this));
        bus.on(Events.AuthError, this.#showServerErrors.bind(this));
        bus.on(Events.ValidationError, this.#showValidationErrors.bind(this));
        bus.on(Events.ValidationOk, this.#showCorrectInputs.bind(this));
    }

    render() {
        const source = `
            <div class="background">
                <img class="background__logo" src="./img/logo.png">
                <div class="authform" id="authFormBackground">
                    <p class="authform__label label">Авторизация</p>
                    <form id="authForm">
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Email</p>
                            <input class ="input-block__input form-input" id="emailInput">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Пароль</p>
                            <input type="password" class ="input-block__input form-input" id="passwordInput">
                        </div>
                        <p class="authform__error error" id="errors"></p>
                        <div class="authform__buttons buttons">
                            <input type="submit" value="ВОЙТИ" class="buttons__button-submit button-submit">
                            <a class="buttons__button-back button-back">НАЗАД</a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template();

        const form = document.getElementById('authForm') as HTMLFormElement;

        const emailInput = document.getElementById('emailInput') as HTMLInputElement;
        this.#inputs.set('email', emailInput);
        const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
        this.#inputs.set('password', passwordInput);

        this.#addListeners.bind(this)(form);
    }

    #addListeners(form: HTMLFormElement) {
        form.addEventListener('submit', this.#authorize.bind(this));
    }

    #authorize(event: Event) {
        event.preventDefault();

        this.#inputsData.clear();
        this.#inputsData.set('email', {errors: [], value: this.#inputs.get('email')?.value.trim() as string});
        this.#inputsData.set('password', {errors: [], value: this.#inputs.get('password')?.value.trim() as string});

        bus.emit(Events.SubmitLogin, this.#inputsData);
    }

    #redirect() {
        const errorsBlock = document.getElementById('errors') as HTMLParagraphElement;
        errorsBlock.innerHTML = '';
        void route(UrlPathnames.Main);
    }

    #showValidationErrors() {
        this.#inputsData.forEach((item, key) => {
            console.log(key);
            const par = this.#inputs.get(key)?.parentElement as HTMLElement;
            console.log(par);
            item.errors.forEach(error => {
                if (error) {
                    this.#inputs.get(key)?.classList.add('form-input_error');
                    par.classList.add('input-block_error');
                    if (par.innerHTML.indexOf(error) === -1) {
                        const temp = window.Handlebars.compile('<p class="input-block__error error">{{error}}</p>');
                        par.innerHTML += temp({error});
                    }
                } else {
                    item.errors = item.errors.slice(1);
                }
            });

            if (!item.errors.length) {
                par.classList.remove('input-block_error');
                this.#inputs.get(key)?.classList.remove('form-input_error');
                this.#inputs.get(key)?.classList.add('form-input_correct');
                while (par.children.length !== 2) {
                    par.removeChild(par.lastChild as ChildNode);
                }
            }
        });
    }

    #showServerErrors(error: string) {
        const errorsBlock = document.getElementById('errors') as HTMLParagraphElement;
        errorsBlock.textContent = error;
    }

    #showCorrectInputs() {
        this.#inputs.forEach(input => {
            const par = input.parentElement as HTMLElement;
            par.classList.remove('input-block_error');
            input.classList.remove('form-input_error');
            input.classList.add('form-input_correct');
            while (par.children.length !== 2) {
                par.removeChild(par.lastChild as ChildNode);
            }
        });
    }
}
