import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

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
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Фамилия</p>
                            <input class ="input-block__input form-input form-input_auth" id="surnameInput" maxlength="50">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Email</p>
                            <input class ="input-block__input form-input form-input_auth" id="emailInput" maxlength="150">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Пароль</p>
                            <input class ="input-block__input form-input form-input_auth" type="password" 
                            id="passwordInput1" maxlength="50">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Пароль еще раз</p>
                            <input class ="input-block__input form-input form-input_auth" type="password" 
                            id="passwordInput2" maxlength="50">
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
        this.#inputsData.forEach((item, key) => {
            const input = this.#inputs.get(key) as HTMLElement;
            const par = input.parentElement as HTMLElement;
            item.errors.forEach(error => {
                if (error) {
                    input.classList.add('form-input_error');
                    par.classList.add('input-block_error');
                    if (par.innerHTML.indexOf(error) === -1) {
                        const p = document.createElement('p');
                        p.classList.add('input-block__error');
                        p.classList.add('error');
                        p.textContent = error;
                        par.appendChild(p);
                    }
                } else {
                    item.errors = item.errors.slice(1);
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
                const par = input.parentElement as HTMLElement;
                par.classList.remove('input-block_error');
                input.classList.remove('form-input_error');
                input.classList.add('form-input_correct');
                while (par.children.length !== CHILD_NUM) {
                    par.removeChild(par.lastChild as ChildNode);
                }
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
