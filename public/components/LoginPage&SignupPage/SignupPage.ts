import {signupValidateFields} from '../../modules/validation.js';
import {InputErrors} from '../../types';
import {postSignup} from '../../modules/request.js';
import route from '../../modules/routing.js';
import { ApiPostSignupData, UrlPathnames } from '../../types.js';

export default class SignupPageComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const source = `
            <div class = "background">
                <div class = "authform">
                    <p class="authform__label">Регистрация</p>
                    <form id="regForm">
                        <div class="input-block">
                            <p class="input-block__input-label input-label">Имя</p>
                            <input class ="input-block__input input" id="nameInput">
                        </div>
                        <div class="input-block">
                            <p class="input-block__input-label input-label">Фамилия</p>
                            <input class ="input-block__input input" id="surnameInput">
                        </div>
                        <div class="input-block">
                            <p class="input-block__input-label input-label">Email</p>
                            <input class ="input-block__input input" id="emailInput">
                        </div>
                        <div class="input-block">
                            <p class="input-block__input-label input-label">Пароль</p>
                            <input class ="input-block__input input" type="password" id="passwordInput1">
                        </div>
                        <div class="input-block">
                            <p class="input-block__input-label input-label">Пароль еще раз</p>
                            <input class ="input-block__input input" type="password" id="passwordInput2">
                        </div>
                            <input class="submitBtn" type="submit" value="ПОДТВЕРДИТЬ">\
                    </form>
                </div>
            </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template();

        const form = document.getElementById('regForm') as HTMLFormElement
        form.addEventListener('submit', this.registration.bind(this));
    }

    async registration(event: Event) {
        event.preventDefault();

        const errorsBlock = document.getElementById('errorsBlock') as HTMLElement;
        errorsBlock.innerHTML = '';

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

        const valid = this.showErrors(inputs, errorsBlock);
        if (valid) {
            const postData: ApiPostSignupData = {
                name: inputs.get('name')?.value as string,
                surname: inputs.get('surname')?.value as string,
                email: inputs.get('email')?.value as string,
                password: inputs.get('password1')?.value as string
            };
            const error = await postSignup(postData);
            if (error) {
                errorsBlock.innerHTML += window.Handlebars.compile('<p class="errorP">' + error + '</p>')();
            } else {
                route(UrlPathnames.Main);
            }
        }
    }

    showErrors(inputs: Map<string, InputErrors>, errorsBlock: HTMLElement): boolean {
        const errors: string[] = [];
        let valid = true;

        inputs.forEach((item) => {
            item.input.className = 'inputCorrect';
            item.errors.forEach(error => {
                if (error) {
                    item.input.className = 'inputError';
                    valid = false;
                    if (error && errors.indexOf(error) === -1) {
                        errors.push(error);
                    }
                }
            });
        });

        const temp = window.Handlebars.compile(`{{#each errors}}
                                                    <p class="errorP">{{this}}</p>
                                                {{/each}}`);
        errorsBlock.innerHTML += temp({errors});

        return valid;
    }
}
