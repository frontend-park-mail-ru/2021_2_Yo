import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

const CHILD_NUM = 2;

export default class LoginView {
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
            <div class="background">
                <img class="background__logo" src="./img/logo.png">
                <div class="authform" id="authFormBackground">
                    <p class="authform__label label">Авторизация</p>
                    <form id="authForm">
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Email</p>
                            <input class ="input-block__input form-input" id="emailInput">
                        </div>
                        <div class="authform__input-block input-block">
                            <p class="input-block__input-label input-label">Пароль</p>
                            <input type="password" class ="input-block__input form-input" id="passwordInput">
                        </div>
                        <p class="authform__error error" id="errors"></p>
                        <div class="authform__buttons buttons">
                            <input type="submit" value="ВОЙТИ" class="buttons__button-submit button-submit">
                            <a id="back" class="buttons__button-back button-back">НАЗАД</a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template();

        const emailInput = document.getElementById('emailInput') as HTMLInputElement;
        this.#inputs.set('email', emailInput);
        const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
        this.#inputs.set('password', passwordInput);

        this.#addListeners();
    }

    #addListeners() {
        const form = <HTMLElement>document.getElementById('authForm');
        form.addEventListener('submit', this.#authorize.bind(this));

        const back = <HTMLElement>document.getElementById('back');
        back.addEventListener('click', this.#back);
    }

    #removeListeners() {
        const form = document.getElementById('authForm') as HTMLFormElement;
        form.removeEventListener('submit', this.#authorize.bind(this));

        const back = <HTMLElement>document.getElementById('back');
        back.removeEventListener('click', this.#back);
    }

    #back = (event: MouseEvent) => {
        event.preventDefault();
        Bus.emit(Events.RouteBack);
        event.stopPropagation();
    };

    #authorize(event: Event) {
        event.preventDefault();

        const errorsBlock = document.getElementById('errors') as HTMLParagraphElement;
        errorsBlock.innerHTML = '';

        this.#inputsData.clear();
        this.#inputsData.set('email', {errors: [], value: this.#inputs.get('email')?.value.trim() as string});
        this.#inputsData.set('password', {errors: [], value: this.#inputs.get('password')?.value.trim() as string});

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
