const inputLength = new Map([
    ['email', 150],
    ['name', 50],
    ['surname', 50],
    ['password1', 50],
    ['password2', 50],
    ['password', 50],
    ['title', 255],
    ['geo', 255],
    ['category', 30],
    ['description', 500],
    ['text', 2200],
    ['selfDescription', 150],
]);

const MAX_FILE_SIZE_MB = 5242880;

type InputsData = {
    errors: string[],
    value: string,
};

export function authValidateFields(inputsData: Map<string, InputsData>) {
    const email = <InputsData>inputsData.get('email');
    email.errors.push(checkEmail(email.value));

    const password = <InputsData>inputsData.get('password');
    password.errors.push(checkPasswordLength(password.value));

    checkInputLength(inputsData);
}

export function signupValidateFields(inputsData: Map<string, InputsData>) {
    const name = <InputsData>inputsData.get('name');
    const surname = <InputsData>inputsData.get('surname');
    const email = <InputsData>inputsData.get('email');
    const password1 = <InputsData>inputsData.get('password1');
    const password2 = <InputsData>inputsData.get('password2');

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

    checkInputLength(inputsData);
}

export function passwordEditValidateFields(inputsData: Map<string, { errors: string[], value: string }>) {
    const password1 = <InputsData>inputsData.get('password1');
    const password2 = <InputsData>inputsData.get('password2');

    password1.errors.push(checkPasswordLength(password1.value));
    password2.errors.push(checkPasswordLength(password2.value));
    if (checkPasswordsEqual(password1.value, password2.value)) {
        password2.errors.push('Пароли не совпадают');
    }

    checkInputLength(inputsData);
}

export function userEditValidateFields(inputsData: Map<string, { errors: string[]; value: string }>, image: File | undefined) {
    const name = <InputsData>inputsData.get('name');
    const surname = <InputsData>inputsData.get('surname');
    const avatar = <InputsData>inputsData.get('avatar');

    name.errors.push(checkEmpty(name.value));
    name.errors.push(checkForbiddenSymbols(name.value));

    surname.errors.push(checkEmpty(surname.value));
    surname.errors.push(checkForbiddenSymbols(surname.value));

    if (image) {
        avatar.errors.push(checkImageType(image));
        avatar.errors.push(checkImageSize(image));
    }

    checkInputLength(inputsData);
}

export function eventValidateFields(inputsData: Map<string, InputsData>, imageFile: File | undefined) {
    const title = <InputsData>inputsData.get('title');
    const description = <InputsData>inputsData.get('description');
    const text = <InputsData>inputsData.get('text');
    const date = <InputsData>inputsData.get('date');
    const geo = <InputsData>inputsData.get('geo');
    const category = <InputsData>inputsData.get('category');
    const image = <InputsData>inputsData.get('image');

    title.errors.push(checkEmpty(title.value));

    description.errors.push(checkEmpty(description.value));

    text.errors.push(checkEmpty(text.value));

    date.errors.push(checkEmpty(date.value));
    date.errors.push(checkDate(date.value));

    geo.errors.push(checkEmpty(geo.value));

    category.errors.push(checkEmpty(category.value));
    category.errors.push(checkForbiddenSymbols(category.value));

    if (imageFile) {
        image.errors.push(checkImageType(imageFile));
        image.errors.push(checkImageSize(imageFile));
    }

    checkInputLength(inputsData);
}

function checkImageType(image: File) {
    if (!image.type.match('^image/(gif|jpeg|jpg|png|svg|svn|webm|webp|gif)+$')) {
        return 'Неверный формат';
    }
    return '';
}

function checkImageSize(image: File) {
    if (image.size > MAX_FILE_SIZE_MB) {
        return 'Размер не должен превышать 5Mб';
    }
    return '';
}

function checkEmpty(value: string): string {
    if (!value) {
        return 'Заполните поле';
    }
    return '';
}

function checkForbiddenSymbols(value: string): string {
    if (value && !value.match('^[a-zA-Zа-яА-Я]+$')) {
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

function checkDate(value: string): string {
    const date = value.split('.');
    if (parseInt(date[0]) < 0 || parseInt(date[0]) > 31 || parseInt(date[1]) < 0 || parseInt(date[1]) > 12) {
        return 'Такой даты не существует';
    }
    if (value.length && !value.match('^\\s*(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)\\d{2})\\s*$')) {
        return 'Неверный формат. Дата должна соответствовать формату дд.мм.гггг';
    }

    const jsDate = new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0]));
    const today = new Date();
    if (Number(jsDate) < Date.now() &&
        !(jsDate.getDate() == today.getDate() &&
            jsDate.getMonth() == today.getMonth() &&
            jsDate.getFullYear() == today.getFullYear())) {
        return 'Нельзя создать мероприятие в прошлом';
    }
    return '';
}

function checkInputLength(inputsData: Map<string, InputsData>) {
    inputsData.forEach((item, key) => {
        if (item.value) {
            if (item.value.length > (<number>inputLength.get(key))) {
                item.errors.push(`Слишком много символов. Максимальная длина ${<number>inputLength.get(key)}`);
            }
        }
    });
}
