import { authInputsValidation } from "../../modules/validation.js";

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
        const formm = document.getElementById('authForm');
        console.log(form);
        console.log(formm);
        form.addEventListener('submit', (event) => {
            console.log(123);
            event.preventDefault();
            const valid = authInputsValidation(errorsBlock);
        });
    }

}
