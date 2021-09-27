import {signupInputsValidation} from "../../modules/validation.js";
import {Request} from "../../modules/request.js";
import {mainPage} from "../../modules/pageloaders.js";

export default class SignupPageComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const source = `
            <div class = 'signupBackground'>
                <div class = 'signupFormBackground'>
                    <p class='label'>Регистрация</p>
                    <form id='regForm'>
                        <div class = 'topFormDiv'>
                            <p class='smallerLabel'>Личные данные</p>
                            <p>Имя</p>
                            <input id='nameInput'>
                            <p>Фамилия</p>
                            <input id='surnameInput'>
                        </div>
                        <div>
                            <p class='smallerLabel'>Данные для входа в аккаунт</p>
                            <p>Email</p>
                            <input type='email' id='emailInput'>
                            <p>Пароль</p>
                            <input type='password' id='passwordInput1'>
                            <p>Пароль еще раз</p>
                            <input type='password' id='passwordInput2'>
                            <input class='submitBtn' type='submit' value='ПОДТВЕРДИТЬ'>
                        </div>
                        <div id='errors'>
                        </div>
                    </form>
                </div>
            </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template();

        const errorsBlock = document.getElementById('errors') as HTMLElement;

        const form = document.getElementById('regForm')
        form?.addEventListener('submit', (event) => {
            event.preventDefault();

            errorsBlock.innerHTML = ''

            const nameInput = document.getElementById('nameInput') as HTMLInputElement
            const surnameInput = document.getElementById('surnameInput') as HTMLInputElement
            const emailInput = document.getElementById('emailInput') as HTMLInputElement
            const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement
            const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement

            const name = nameInput.value.trim()
            const surname = surnameInput.value.trim()
            const email = emailInput.value.trim()
            const password1 = passwordInput1.value.trim()

            const valid = signupInputsValidation(errorsBlock, nameInput, surnameInput, emailInput, passwordInput1, passwordInput2);
            if (valid) {
                const req = new Request()
                req.postFetch('https://yobmstu.herokuapp.com/signup', {
                    name,
                    surname,
                    email,
                    password: password1
                })
                    .then(({status, parsedBody}) => {
                        console.log(status, " ", parsedBody)
                        if (status === 200) {
                            mainPage()
                        } else {
                            const error = parsedBody.error
                            errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>` + error + `</p>`)()
                        }
                    })
            }
        });
    }
}
