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
                        <div class="input-block">
                            <p class="input-block__input-label input-label">Email</p>
                            <input class ="input-block__input input" id="emailInput">
                        </div>
                        <div class="input-block">
                            <p class="input-block__input-label input-label">Пароль</p>
                            <input type="password" class ="input-block__input input" id="passwordInput">
                        </div>
                        <div class="buttons">
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

        form.addEventListener('submit', this.authorization.bind(this));
    }

    async authorization(event: Event) {
        event.preventDefault();

        const errorsBlock = document.getElementById('errorsBlock') as HTMLElement;
        // errorsBlock.innerHTML = ''

        const emailInput = document.getElementById('emailInput') as HTMLInputElement
        const passwordInput = document.getElementById('passwordInput') as HTMLInputElement
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
        const valid = this.showErrors(inputs, errorsBlock);
        if (valid) {
            const postData: ApiPostLoginData = {
                email: inputs.get('email')?.value as string,
                password: inputs.get('password')?.value as string,
            };
            const error = await postLogin(postData);
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
                        const temp = window.Handlebars.compile(`<p class="errorP">{{error}}</p>`);
                        let par = item.input.parentElement as HTMLElement
                        par.innerHTML+=temp({error})
                    }
                }
            })
        });

        // const temp = window.Handlebars.compile(`{{#each errors}}
        //                                             <p class="errorP">{{this}}</p>
        //                                         {{/each}}`);
        // errorsBlock.innerHTML += temp({errors});

        return valid;
    }

}
