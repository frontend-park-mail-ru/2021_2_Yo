import {authValidateFields} from '../../modules/validation.js';
import {InputErrors} from '../../types';
import {postLogin} from '../../modules/request.js';
import route from '../../modules/routing.js';
import {ApiPostLoginData, UrlPathnames} from '../../types.js';

export default class LoginPageComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const source = `
            <div class="background">
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
                        <div class="authform__buttons buttons">
                            <input type="submit" value="ВОЙТИ" class="buttons__button-submit button-submit">
                            <a class="buttons__button-back button-back">НАЗАД</a>
                        </div>
                        <p class="authform__error error" id="errors"></p>
                    </form>
                </div>
            </div>
        `;

        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template();

        const form = document.getElementById('authForm') as HTMLFormElement;

        form.addEventListener('submit', this.authorization.bind(this));
    }

    async authorization(event: Event) {
        event.preventDefault();

        const emailInput = document.getElementById('emailInput') as HTMLInputElement;
        const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
        const inputs = new Map([
            ['email', {
                input: emailInput,
                errors: [],
                value: emailInput.value.trim()
            }],
            ['password', {
                input: passwordInput,
                errors: [],
                value: passwordInput.value.trim()
            }],
        ]);

        authValidateFields(inputs);
        const valid = this.showErrors(inputs);
        if (valid) {
            const postData: ApiPostLoginData = {
                email: inputs.get('email')?.value as string,
                password: inputs.get('password')?.value as string,
            };
            const error = await postLogin(postData);
            if (error) {
                let errorsBlock = document.getElementById("errors") as HTMLParagraphElement
                errorsBlock.textContent = error
            } else {
                route(UrlPathnames.Main);
            }
        }
    }

    showErrors(inputs: Map<string, InputErrors>): boolean {
        let valid = true;

        inputs.forEach((item) => {
            let par = item.input.parentElement as HTMLElement

            item.errors.forEach(error => {
                if (error) {
                    item.input.classList.add("form-input_error")
                    par.classList.add("input-block_error")
                    valid = false;
                    if (par.innerHTML.indexOf(error) === -1) {
                        const temp = window.Handlebars.compile(`<p class="input-block__error error">{{error}}</p>`);
                        par.innerHTML += temp({error})
                    }
                } else {
                    item.errors = item.errors.slice(1)
                }
            })

            if (!item.errors.length) {
                par.classList.remove("input-block_error")
                item.input.classList.remove("form-input_error")
                item.input.classList.add("form-input_correct");
                while (par.children.length !== 2) {
                    par.removeChild(par.lastChild as ChildNode);
                }
            }
        });

        return valid;
    }
}
