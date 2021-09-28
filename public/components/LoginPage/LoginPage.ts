import {authValidateFields} from "../../modules/validation.js";
import {InputErrors} from "../../types";

export default class LoginPageComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const source = `
            <div class = 'background'>
                <div class ='authFormBackground' id='authFormBackground'>
                    <p class = 'label'>Авторизация</p>
                    <form id='authForm'>
                        <p>Email</p>
                        <input id='emailInput'>
                        <p>Пароль</p>
                        <input type='password' id='passwordInput'>
                        <input type='submit' value="ВОЙТИ" class='submitBtn'>
                        <div id='errorsBlock'></div>
                    </form>
                </div>
            </div>
        `;

        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template();

        const form = document.getElementById('authForm') as HTMLFormElement;

        form.addEventListener('submit', this.authorization.bind(this));
    }

    authorization(event: Event) {
        event.preventDefault();

        const errorsBlock = document.getElementById('errorsBlock') as HTMLElement;
        errorsBlock.innerHTML = ''

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
        console.log(this)
        const valid = this.showErrors(inputs, errorsBlock);
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
            })
        });

        const temp = window.Handlebars.compile(`{{#each errors}}
                                                <p class='errorP'>{{this}}</p>
                                            {{/each}}`);
        errorsBlock.innerHTML += temp({errors});

        return valid;
    }
}
