import { signupInputsValidation } from "../../modules/validation.js";

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
            console.log(123);
            event.preventDefault();
            const valid = signupInputsValidation(errorsBlock);
        });
    }
}
