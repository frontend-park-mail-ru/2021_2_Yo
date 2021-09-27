import {authInputsValidation, validateFields} from "../../modules/validation.js";
import {InputErrors} from "../../types.js"

export default class LoginPageComponent {
    #parent: HTMLElement

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
                        <input type='email' id='emailInput'>
                        <p>Пароль</p>
                        <input type='password' id='passwordInput'>
                        <input type='submit' value="ВОЙТИ" class='submitBtn'>
                        <div id='errors'>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template();

        const errorsBlock = document.getElementById('errors') as HTMLElement;

        const form = document.getElementById('authForm') as HTMLFormElement;

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const emailInput = document.getElementById('emailInput') as HTMLInputElement
            const passwordInput = document.getElementById('passwordInput') as HTMLInputElement
            let inputs = new Map([
                ['email', {
                    input: emailInput,
                    errors: []
                }],
                ['password', {
                    input: passwordInput,
                    errors: []
                }],
            ])

            const email = emailInput.value.trim()
            const password = passwordInput.value.trim()

            validateFields(inputs)

            
            const valid = authInputsValidation(errorsBlock);
        });
    }

}
