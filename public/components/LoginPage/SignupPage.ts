import {signupValidateFields} from "../../modules/validation.js";
import {InputErrors} from "../../types";

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
                            <input id='emailInput'>
                            <p>Пароль</p>
                            <input type='password' id='passwordInput1'>
                            <p>Пароль еще раз</p>
                            <input type='password' id='passwordInput2'>
                            <input class='submitBtn' type='submit' value='ПОДТВЕРДИТЬ'>
                        </div>
                        <div id='errorsBlock'>
                        </div>
                    </form>
                </div>
            </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template();

        const form = document.getElementById('regForm') as HTMLFormElement
        form.addEventListener('submit', this.registration.bind(this));
    }

    registration(event: Event) {
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
