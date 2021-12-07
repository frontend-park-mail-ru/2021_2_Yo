import { InputData, UserData } from '@/types';
import Events from '@eventbus/events';
import Bus from '@eventbus/eventbus';
import UserStore from '@modules/userstore';
import * as template from '@profile-page/templates/profileedit.hbs';
import * as profileForm from '@profile-page/templates/profileeditform.hbs';
import * as passwordForm from '@profile-page/templates/passwordeditform.hbs';

export default class ProfileEditForm {
    #parent: HTMLElement;
    #user?: UserData;
    #inputs = new Map<string, HTMLInputElement>();
    #inputsData = new Map<string, InputData>();
    #profileEditButton?: HTMLElement;
    #passwordEditButton?: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    subscribe() {
        Bus.on(Events.ValidationError, this.#validationHandle);
        Bus.on(Events.ValidationOk, this.#validationHandle);
    }

    #validationHandle = (() => {
        this.#showValidationErrors();
        this.#showCorrectInputs();
    }).bind(this);

    render(user?: UserData) {
        this.#parent.innerHTML = template();
        this.#user = user;
        this.#renderProfileEdit(user);
        this.#addListeners();
    }

    #renderProfileEdit(user?: UserData) {
        this.#profileEditButton?.classList.add('menu__item_clicked');
        this.#passwordEditButton?.classList.remove('menu__item_clicked');

        const formContainer = <HTMLElement>document.getElementById('formContainer');
        formContainer.innerHTML = profileForm({ user });

        const form = <HTMLElement>document.getElementById('form');
        form.addEventListener('submit', this.#mainFormSubmitHandle.bind(this));

        const cancelButton = <HTMLElement>document.getElementById('cancelButton');
        cancelButton.addEventListener('click', this.#cancelEdit);

        const imageInput = <HTMLInputElement>document.getElementById('avatarInput');
        imageInput.addEventListener('change', this.#showPhoto.bind(this, imageInput));
    }

    #renderPasswordEdit() {
        this.#profileEditButton?.classList.remove('menu__item_clicked');
        this.#passwordEditButton?.classList.add('menu__item_clicked');

        const formContainer = <HTMLElement>document.getElementById('formContainer');
        formContainer.innerHTML = passwordForm();

        const passForm = <HTMLElement>document.getElementById('passwordForm');
        passForm.addEventListener('submit', this.#passwordFormSubmitHandle.bind(this));

        const cancelButton = <HTMLElement>document.getElementById('cancelButton');
        cancelButton.addEventListener('click', this.#cancelEdit);
    }

    disable() {
        Bus.off(Events.ValidationError, this.#validationHandle);
        Bus.off(Events.ValidationOk, this.#validationHandle);

        this.#removeListeners();
    }

    #cancelEdit = ((ev: Event) => {
        ev.preventDefault();

        Bus.emit(Events.UserRes, UserStore.get());
    });

    #addListeners() {
        this.#profileEditButton = <HTMLElement>document.getElementById('profileEdit');
        this.#profileEditButton.addEventListener('click', this.#renderProfileEdit.bind(this, this.#user));

        this.#passwordEditButton = <HTMLElement>document.getElementById('passwordEdit');
        this.#passwordEditButton.addEventListener('click', this.#renderPasswordEdit.bind(this));
    }

    #removeListeners() {
        const form = <HTMLElement>document.getElementById('form');
        if (form) {
            form.removeEventListener('submit', this.#mainFormSubmitHandle.bind(this));
        }

        const passwordForm = <HTMLElement>document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.removeEventListener('submit', this.#passwordFormSubmitHandle.bind(this));
        }

        const cancelButton = <HTMLElement>document.getElementById('cancelButton');
        if (cancelButton) {
            cancelButton.removeEventListener('click', this.#cancelEdit);
        }

        if (this.#profileEditButton) {
            this.#profileEditButton.addEventListener('click', this.#renderProfileEdit.bind(this, this.#user));
        }

        if (this.#passwordEditButton) {
            this.#passwordEditButton.addEventListener('click', this.#renderPasswordEdit.bind(this));
        }

        this.#inputs.forEach((input, key) => {
            if (input) {
                input.removeEventListener('input', this.#handleInputChange.bind(this, input, key));
            }
        });
    }

    #passwordFormSubmitHandle = ((ev: Event) => {
        ev.preventDefault();

        this.#inputsData.clear();
        this.#inputs.clear();

        const passwordInput1 = <HTMLInputElement>document.getElementById('passwordInput1');
        this.#inputs.set('password1', passwordInput1); 
        this.#inputsData.set('password1', { errors: [], value: passwordInput1.value.trim() }); 
        const passwordInput2 = <HTMLInputElement>document.getElementById('passwordInput2');
        this.#inputs.set('password2', passwordInput2);
        this.#inputsData.set('password2', { errors: [], value: passwordInput2.value.trim() });

        this.#inputs.forEach((input, key) => {
            input.addEventListener('input', this.#handleInputChange.bind(this, input, key));
        });

        Bus.emit(Events.UserPasswordEditReq, this.#inputsData);
    });

    #mainFormSubmitHandle = ((ev: Event) => {
        ev.preventDefault();

        this.#inputsData.clear();
        this.#inputs.clear();

        const nameInput = <HTMLInputElement>document.getElementById('nameInput');
        this.#inputs.set('name', nameInput);
        this.#inputsData.set('name', { errors: [], value: nameInput.value.trim() });

        const surnameInput = <HTMLInputElement>document.getElementById('surnameInput');
        this.#inputs.set('surname', surnameInput);
        this.#inputsData.set('surname', { errors: [], value: surnameInput.value.trim() });

        const selfDescriptionInput = <HTMLInputElement>document.getElementById('selfDescriptionInput');
        this.#inputs.set('selfDescription', selfDescriptionInput);
        this.#inputsData.set('selfDescription', { errors: [], value: selfDescriptionInput.value.trim() });

        const avatarInput = <HTMLInputElement>document.getElementById('avatarInput');
        this.#inputs.set('avatar', avatarInput);
        this.#inputsData.set('avatar', { errors: [], value: '' });
        let file: File | undefined;
        if (avatarInput.files) file = avatarInput.files[0];

        this.#inputs.forEach((input, key) => {
            input.addEventListener('input', this.#handleInputChange.bind(this, input, key));
        });

        Bus.emit(Events.UserEditReq, { input: this.#inputsData, file });
    });

    #showValidationErrors() {
        this.#inputs.forEach((input, key) => {
            const inputError = <HTMLElement>document.getElementById(key + 'Error');
            inputError.classList.add('error_none');
            const inputData = <InputData>this.#inputsData.get(key);

            inputData.errors.forEach(error => {
                if (error) {
                    input.classList.add('form-input_error');
                    inputError.classList.remove('error_none');
                    inputError.textContent = error;
                } else {
                    inputData.errors = inputData.errors.slice(1);
                }
            });
        });
    }


    #showCorrectInputs() {
        this.#inputs.forEach((input, key) => {
            if (!this.#inputsData.get(key)?.errors.length) {
                const inputError = <HTMLElement>document.getElementById(key + 'Error');
                inputError.classList.add('error_none');

                input.classList.add('form-input_correct');
            }
        });
    }

    #showPhoto() {
        const reader = new FileReader();

        const imageInput = <HTMLInputElement>document.getElementById('avatarInput');
        if (imageInput.files) {
            const selectedFile = imageInput?.files[0];
            reader.readAsDataURL(selectedFile);
        }

        const photoBlock = <HTMLImageElement>document.getElementById('photo');

        reader.onload = function (event) {
            if (reader.result) {
                photoBlock.classList.remove('photo-input_none');
                photoBlock.src = <string>reader.result;
            }
        };

        const photoLabel = <HTMLInputElement>document.getElementById('photo-label');
        photoLabel.value = 'Удалить фото';
        photoLabel.addEventListener('click', this.#deletePhoto.bind(this));
        photoLabel.style.cursor = 'pointer';
    }

    #deletePhoto() {
        const photoBlock = <HTMLImageElement>document.getElementById('photo');
        photoBlock.classList.add('photo-input_none');

        const photoLabel = <HTMLInputElement>document.getElementById('photo-label');
        photoLabel.value = 'Не выбрано';

        photoLabel.removeEventListener('click', this.#deletePhoto.bind(this));
        photoLabel.style.cursor = '';

        const imageInput = <HTMLInputElement>document.getElementById('imageInput');
        imageInput.files = null;
        imageInput.value = '';
    }

    #handleInputChange(input: HTMLInputElement, key: string) {
        input.classList.remove('form-input_correct');
        input.classList.remove('form-input_error');
        const inputError = <HTMLElement>document.getElementById(key + 'Error');
        inputError.classList.add('error_none');

        if (input.value.trim()) {
            input.classList.add('form-input_changed');
        } else {
            input.classList.remove('form-input_changed');
        }
    }

}
