import {authInputsValidation} from "../../modules/validation.js";
import {Request} from "../../modules/request.js";

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

            errorsBlock.innerHTML = ''

            const emailInput = document.getElementById('emailInput') as HTMLInputElement
            const passwordInput = document.getElementById('passwordInput') as HTMLInputElement

            const email = emailInput.value.trim()
            const password = passwordInput.value.trim()

            const valid = authInputsValidation(errorsBlock, emailInput, passwordInput);
            if (valid) {
                const req = new Request()
                req.postFetch('https://yobmstu.herokuapp.com/signin', {email: email, password: password})
                    .then(({status, parsedBody}) => {
                        console.log(status, " ", parsedBody)
                        if (status == 200) {
                            // все ок, редирект на главную
                        } else {
                            errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Ошибка авторизации</p>`)()
                        }
                    })
            }
        });
    }

}
