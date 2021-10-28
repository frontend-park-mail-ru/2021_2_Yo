import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

const CHILD_NUM = 2;

export default class SignupView {
    #parent: HTMLElement;
    #inputs = new Map<string, HTMLInputElement>();
    #inputsData = new Map<string, { errors: string[], value: string }>();

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.AuthError, this.#validationHandle);
        Bus.on(Events.ValidationError, this.#validationHandle);
        Bus.on(Events.ValidationOk, this.#validationHandle);
    }

    #validationHandle = ((error: string) => {
        this.#showValidationErrors();
        this.#showCorrectInputs();
        if (error) {
            this.#showServerErrors(error);
        }
    }).bind(this);

    render() {
        const source = `
            <div class = "auth-background">
                <img class="background__logo" src="./img/logo.png">
                <div class = "authform">
                    <p class="authform__label label">Регистрация</p>
                    <form id="regForm">
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Имя</p>
                            <input class ="input-block__input form-input form-input_auth" id="nameInput" maxlength="50">
                            <p class="error error_none input-block__error"></p>
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Фамилия</p>
                            <input class ="input-block__input form-input form-input_auth" id="surnameInput" maxlength="50">
                            <p class="error error_none input-block__error"></p>
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Email</p>
                            <input class ="input-block__input form-input form-input_auth" id="emailInput" maxlength="150">
                            <p class="error error_none input-block__error"></p>
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Пароль</p>
                            <input class ="input-block__input form-input form-input_auth" type="password" 
                            id="passwordInput1" maxlength="255">
                            <p class="error error_none input-block__error"></p>
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Пароль еще раз</p>
                            <input class ="input-block__input form-input form-input_auth" type="password" 
                            id="passwordInput2" maxlength="255">
                            <p class="error error_none input-block__error"></p>
                        </div>
                        <p class="authform__error error" id="errors"></p>
                        <div class="authform__buttons buttons">
                            <input type="submit" value="ЗАРЕГИСТРИРОВАТЬСЯ" class="buttons__button-submit button-submit">
                            <a id="back" class="buttons__button-back button-back">НАЗАД</a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template();

        const nameInput = document.getElementById('nameInput') as HTMLInputElement;
        this.#inputs.set('name', nameInput);
        const surnameInput = document.getElementById('surnameInput') as HTMLInputElement;
        this.#inputs.set('surname', surnameInput);
        const emailInput = document.getElementById('emailInput') as HTMLInputElement;
        this.#inputs.set('email', emailInput);
        const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement;
        this.#inputs.set('password1', passwordInput1);
        const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement;
        this.#inputs.set('password2', passwordInput2);

        this.#addListeners();
    }

    #addListeners() {
        const form = document.getElementById('regForm') as HTMLFormElement;
        form.addEventListener('submit', this.#signup.bind(this));

        const back = <HTMLElement>document.getElementById('back');
        back.addEventListener('click', this.#back);
    }

    #removeListeners() {
        const form = document.getElementById('regForm') as HTMLFormElement;
        form.removeEventListener('submit', this.#signup.bind(this));

        const back = <HTMLElement>document.getElementById('back');
        back.addEventListener('click', this.#back);
    }

    #back = (event: MouseEvent) => {
        event.preventDefault();
        Bus.emit(Events.RouteBack);
        event.stopPropagation();
    };

    #signup(event: Event) {
        event.preventDefault();

        const errorsBlock = document.getElementById('errors') as HTMLParagraphElement;
        errorsBlock.innerHTML = '';

        this.#inputsData.clear();
        this.#inputsData.set('name', {errors: [], value: this.#inputs.get('name')?.value.trim() as string});
        this.#inputsData.set('surname', {errors: [], value: this.#inputs.get('surname')?.value.trim() as string});
        this.#inputsData.set('email', {errors: [], value: this.#inputs.get('email')?.value.trim() as string});
        this.#inputsData.set('password1', {errors: [], value: this.#inputs.get('password1')?.value.trim() as string});
        this.#inputsData.set('password2', {errors: [], value: this.#inputs.get('password2')?.value.trim() as string});

        Bus.emit(Events.SubmitLogin, this.#inputsData);
    }

    #showValidationErrors() {
        this.#inputs.forEach((input, key) => {
            const inputBlock = input.parentElement as HTMLElement;
            const errorP = inputBlock.lastElementChild as HTMLElement;
            const inputData = this.#inputsData.get(key) as { errors: string[], value: string };

            inputData.errors.forEach(error => {
                if (error) {
                    inputBlock.classList.add('input-block_error');

                    if (inputBlock.innerHTML.indexOf(error) === -1) {
                        errorP.classList.remove('error_none');
                        errorP.textContent = error;
                    }
                } else {
                    inputData.errors = inputData.errors.slice(1);
                }
            });
        });
    }

    #showServerErrors(error: string) {
        const errorsBlock = document.getElementById('errors') as HTMLParagraphElement;
        errorsBlock.textContent = error;
    }

    #showCorrectInputs() {
        this.#inputs.forEach((input, key) => {
            if (!this.#inputsData.get(key)?.errors.length) {
                const inputBlock = input.parentElement as HTMLElement;
                inputBlock.classList.remove('input-block_error');

                const errorP = inputBlock.lastElementChild as HTMLElement;
                errorP.textContent = '';
                errorP.classList.add('error_none');
            }
        });
    }

    disable() {
        this.#removeListeners();

        this.#parent.innerHTML = '';

        Bus.off(Events.AuthError, this.#validationHandle);
        Bus.off(Events.ValidationError, this.#validationHandle);
        Bus.off(Events.ValidationOk, this.#validationHandle);
    }
}
