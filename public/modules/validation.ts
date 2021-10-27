export function authValidateFields(inputsData: Map<string, { errors: string[], value: string }>) {
    const email = inputsData.get('email') as { errors: string[], value: string };
    email.errors.push(checkEmail(email.value));

    const password = inputsData.get('password') as { errors: string[], value: string };
    password.errors.push(checkPasswordLength(password.value));
}

export function signupValidateFields(inputsData: Map<string, { errors: string[], value: string }>) {
    const name = inputsData.get('name') as { errors: string[], value: string };
    const surname = inputsData.get('surname') as { errors: string[], value: string };
    const email = inputsData.get('email') as { errors: string[], value: string };
    const password1 = inputsData.get('password1') as { errors: string[], value: string };
    const password2 = inputsData.get('password2') as { errors: string[], value: string };

    name.errors.push(checkEmpty(name.value));
    name.errors.push(checkForbiddenSymbols(name.value));

    surname.errors.push(checkEmpty(surname.value));
    surname.errors.push(checkForbiddenSymbols(surname.value));

    email.errors.push(checkEmail(email.value));

    password1.errors.push(checkPasswordLength(password1.value));
    password2.errors.push(checkPasswordLength(password2.value));
    if (checkPasswordsEqual(password1.value, password2.value)) {
        password2.errors.push('Пароли не совпадают');
    }
}

export function eventValidateFields(inputsData: Map<string, { errors: string[], value: string }>) {
    const title = inputsData.get('title') as { errors: string[], value: string };
    const description = inputsData.get('description') as { errors: string[], value: string };
    const text = inputsData.get('text') as { errors: string[], value: string };
    const date = inputsData.get('date') as { errors: string[], value: string };
    const city = inputsData.get('city') as { errors: string[], value: string };
    const geo = inputsData.get('geo') as { errors: string[], value: string };
    const category = inputsData.get('category') as { errors: string[], value: string };

    title.errors.push(checkEmpty(title.value));
    description.errors.push(checkEmpty(description.value));
    text.errors.push(checkEmpty(text.value));
    date.errors.push(checkEmpty(date.value));
    geo.errors.push(checkEmpty(geo.value));

    city.errors.push(checkEmpty(city.value));
    city.errors.push(checkForbiddenSymbols(city.value));

    category.errors.push(checkEmpty(category.value));
    category.errors.push(checkForbiddenSymbols(category.value));
}

function checkEmpty(value: string): string {
    if (!value) {
        return 'Заполните поле';
    }
    return '';
}

function checkForbiddenSymbols(value: string): string {
    if (!value.match('^[a-zA-Zа-яА-Я]+$') && value) {
        return 'Поле может содержать только буквы';
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
