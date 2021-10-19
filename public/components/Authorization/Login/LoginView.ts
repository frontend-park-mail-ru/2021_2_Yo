import {ApiPostLoginData, InputErrors, UrlPathnames} from '../../../types.js';
import route from '../../../modules/routing.js';
import bus, {Events} from '../../../modules/eventbus.js';

export default class LoginView {
    #parent: HTMLElement;
    #form: HTMLFormElement;
    #emailInput: HTMLInputElement;
    #passwordInput: HTMLInputElement;
    inputs = new Map<string, InputErrors>();

    constructor(parent: HTMLElement) {
        this.#parent = parent;
        this.#form = document.getElementById('authForm') as HTMLFormElement;
        this.#emailInput = document.getElementById('emailInput') as HTMLInputElement
        this.#passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
        bus.on(Events.UserLogin, this.#redirect)
        bus.on(Events.AuthError, this.#showErrors)
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

        this.#form = document.getElementById('authForm') as HTMLFormElement;
        this.#emailInput = document.getElementById('emailInput') as HTMLInputElement
        this.#passwordInput = document.getElementById('passwordInput') as HTMLInputElement;

        this.#addListeners()
    }

    #addListeners() {
        this.#form.addEventListener('submit', this.#authorize.bind(this));
    }

    #authorize(event: Event) {
        event.preventDefault();
        this.inputs.set('email', {
            input: this.#emailInput,
            errors: [],
            value: this.#emailInput.value.trim()
        })
        this.inputs.set('password', {
            input: this.#passwordInput,
            errors: [],
            value: this.#passwordInput.value.trim()
        })
        bus.emit(Events.SubmitLogin, this.inputs)
    }

    #redirect = async (args: { inputs: Map<string, InputErrors> }): Promise<void> => {
        route(UrlPathnames.Main);
    }

    #showErrors(inputs: Map<string, InputErrors>) {
        inputs.forEach((item) => {
            const
                par = item.input.parentElement as HTMLElement

            item.errors.forEach(error => {
                if (error) {
                    item.input.classList.add('form-input_error')
                    par.classList.add('input-block_error')
                    if (par.innerHTML.indexOf(error) === -1) {
                        const temp = window.Handlebars.compile('<p class="input-block__error error">{{error}}</p>');
                        par.innerHTML += temp({error})
                    }
                } else {
                    item.errors = item.errors.slice(1)
                }
            })

            if (!item.errors.length) {
                par.classList.remove('input-block_error')
                item.input.classList.remove('form-input_error')
                item.input.classList.add('form-input_correct');
                while (par.children.length !== 2) {
                    par.removeChild(par.lastChild as ChildNode);
                }
            }
        });
    }
}
