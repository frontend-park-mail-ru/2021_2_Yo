import {signupValidateFields} from '../../modules/validation.js';
import {InputErrors} from '../../types';
import {postSignup} from '../../modules/request/request.js';
import Router from '../../modules/routing.js';
import {ApiPostSignupData, UrlPathnames} from '../../types.js';

export default class SignupPageComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

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

        const form = document.getElementById('regForm') as HTMLFormElement;
        form.addEventListener('submit', () => this.registration.bind(this));
    }

    async registration(event: Event) {
        event.preventDefault();

        const nameInput = document.getElementById('nameInput') as HTMLInputElement;
        const surnameInput = document.getElementById('surnameInput') as HTMLInputElement;
        const emailInput = document.getElementById('emailInput') as HTMLInputElement;
        const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement;
        const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement;

        const inputs = new Map([
            ['email', {
                input: emailInput,
                errors: [],
                value: emailInput.value.trim()
            }],
            ['password1', {
                input: passwordInput1,
                errors: [],
                value: passwordInput1.value.trim()
            }],
            ['password2', {
                input: passwordInput2,
                errors: [],
                value: passwordInput2.value.trim()
            }],
            ['name', {
                input: nameInput,
                errors: [],
                value: nameInput.value.trim()
            }],
            ['surname', {
                input: surnameInput,
                errors: [],
                value: surnameInput.value.trim()
            }],
        ]);

        signupValidateFields(inputs);

        const valid = this.showErrors(inputs);
        if (valid) {
            const postData: ApiPostSignupData = {
                name: inputs.get('name')?.value as string,
                surname: inputs.get('surname')?.value as string,
                email: inputs.get('email')?.value as string,
                password: inputs.get('password1')?.value as string
            };
            const error = await postSignup(postData);
            if (error) {
                const errorsBlock = document.getElementById('errors') as HTMLParagraphElement;
                errorsBlock.textContent = error;
            } else {
                Router.route(UrlPathnames.Main);
            }
        }
    }

    showErrors(inputs: Map<string, InputErrors>): boolean {
        let valid = true;

        inputs.forEach((item) => {
            const par = item.input.parentElement as HTMLElement;

            item.errors.forEach(error => {
                if (error) {
                    item.input.classList.add('form-input_error');
                    par.classList.add('input-block_error');
                    valid = false;
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
                item.input.classList.remove('form-input_error');
                item.input.classList.add('form-input_correct');
                while (par.children.length !== 2) {
                    par.removeChild(par.lastChild as ChildNode);
                }
            }
        });

        return valid;
    }
}
