import {InputErrors} from "../types.js";

export function authValidateFields(inputs: Map<string, InputErrors>) {
    const email = inputs.get('email') as InputErrors;
    email.errors.push(checkEmail(email.value));

    const password = inputs.get('password') as InputErrors;
    password.errors.push(checkPasswordLength(password.value));
}

export function signupValidateFields(inputs: Map<string, InputErrors>) {
    const name = inputs.get('name') as InputErrors;
    const surname = inputs.get('surname') as InputErrors;
    const email = inputs.get('email') as InputErrors;
    const password1 = inputs.get('password1') as InputErrors;
    const password2 = inputs.get('password2') as InputErrors;

    name.errors.push(checkEmpty(name.value));
    name.errors.push(checkForbiddenSymbols(name.value));

    surname.errors.push(checkEmpty(surname.value));
    surname.errors.push(checkForbiddenSymbols(surname.value));

    email.errors.push(checkEmail(email.value));

    password1.errors.push(checkPasswordLength(password1.value));
    password2.errors.push(checkPasswordLength(password2.value));
    if (checkPasswordsEqual(password1.value, password2.value)) {
        password1.errors.push('Пароли не совпадают');
        password2.errors.push('Пароли не совпадают');
    }
}

function checkEmpty(value: string): string {
    if (!value) {
        return 'Заполните все поля';
    }
    return '';
}

function checkForbiddenSymbols(value: string): string {
    if (!value.match('^[a-zA-Zа-яА-Я]+$')) {
        return 'Поля "Имя" и "Фамилия" могут содержать только буквы';
    }
    return '';
}

function checkPasswordLength(value: string): string {
    if (value.length < 8) {
        return 'Пароль не может быть короче 8 символов';
    }
    return '';
}

function checkPasswordsEqual(pas1: string, pas2: string): boolean {
    if (pas1 !== pas2) {
        return true;
    }
    return false;
}

function checkEmail(value: string): string {
    if (!value.match('([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$')) {
        return 'Неправильный формат Email. Пример правильного формата: mail@mail.ru';
    }
    return '';
}
