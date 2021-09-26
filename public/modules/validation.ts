export function authInputsValidation(errorsBlock: HTMLElement): boolean {
    let valid = true

    const emailInput = document.getElementById('emailInput') as HTMLInputElement
    const passwordInput = document.getElementById('passwordInput') as HTMLInputElement

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    errorsBlock.innerHTML = ''

    if (!email) {
        valid = false
        emailInput.className = 'inputError'
        errorsBlock.innerHTML += window.Handlebars.compile('<p class="errorP">Введите Email</p>')()
    } else {
        emailInput.className = 'inputCorrect'
    }

    if (password.length < 8) {
        valid = false
        passwordInput.className = 'inputError'
        errorsBlock.innerHTML += window.Handlebars.compile('<p class="errorP">Пароль не может быть короче 8 символов</p>')()
    } else {
        passwordInput.className = 'inputCorrect'
    }

    return valid
}

export function signupInputsValidation(errorsBlock: HTMLElement): boolean {
    let valid: boolean

    errorsBlock.innerHTML = ''

    const nameInput = document.getElementById('nameInput') as HTMLInputElement
    const surnameInput = document.getElementById('surnameInput') as HTMLInputElement
    const emailInput = document.getElementById('emailInput') as HTMLInputElement
    const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement
    const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement

    const flagEmpty = checkInputsEmpty(nameInput, surnameInput, emailInput, passwordInput1, passwordInput2)
    const flagPasswordLength = checkPasswordsLength(passwordInput1, passwordInput2)
    const flagIncorrectPasswords = checkPasswords(passwordInput1, passwordInput2)
    const flagForbiddenSymbols = checkForbiddenSymbols(nameInput, surnameInput)

    let errors = ''

    if (flagEmpty) {
        errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Заполните все поля</p>`)()
    }
    if (flagIncorrectPasswords) {
        errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Пароли не совпадают</p>`)()
    }
    if (flagForbiddenSymbols) {
        errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Запрещенные символы в полях ввода</p>`)()
    }
    if (flagPasswordLength) {
        errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Пароль должен содержать не менее 8 символов</p>`)()
    }

    valid = !(flagEmpty || flagIncorrectPasswords || flagPasswordLength || flagForbiddenSymbols)

    return valid
}

function checkInputsEmpty(nameInput: HTMLInputElement,
                          surnameInput: HTMLInputElement,
                          emailInput: HTMLInputElement,
                          passwordInput1: HTMLInputElement,
                          passwordInput2: HTMLInputElement): boolean {
    let flagEmpty = false

    const name = nameInput.value.trim()
    const surname = surnameInput.value.trim()
    const email = emailInput.value.trim()
    const password1 = passwordInput1.value.trim()
    const password2 = passwordInput2.value.trim()

    if (!name) {
        nameInput.className = 'inputError'
        flagEmpty = true
    }

    if (!surname) {
        surnameInput.className = 'inputError'
        flagEmpty = true
    }

    if (!email) {
        emailInput.className = 'inputError'
        flagEmpty = true
    } else {
        emailInput.className = 'inputCorrect'
    }

    if (!password1) {
        passwordInput1.className = 'inputError'
        flagEmpty = true
    }

    if (!password2) {
        passwordInput2.className = 'inputError'
        flagEmpty = true
    }

    return flagEmpty
}

function checkPasswords(passwordInput1: HTMLInputElement, passwordInput2: HTMLInputElement): boolean {
    let flagIncorrectPasswords = false

    const password1 = passwordInput1.value.trim()
    const password2 = passwordInput2.value.trim()

    if (password1 !== password2) {
        passwordInput1.className = 'inputError'
        passwordInput2.className = 'inputError'
        flagIncorrectPasswords = true
    }

    return flagIncorrectPasswords
}

function checkForbiddenSymbols(nameInput: HTMLInputElement, surnameInput: HTMLInputElement): boolean {
    let flagForbiddenSymbols = false

    const name = nameInput.value.trim()
    const surname = surnameInput.value.trim()

    if (name.match('^[a-zA-Zа-яА-Я]+$')) {
        nameInput.className = 'inputCorrect'
    } else if (name) {
        nameInput.className = 'inputError'
        flagForbiddenSymbols = true
    }

    if (surname.match('^[a-zA-Zа-яА-Я]+$')) {
        surnameInput.className = 'inputCorrect'
    } else if (surname) {
        surnameInput.className = 'inputError'
        flagForbiddenSymbols = true
    }

    return flagForbiddenSymbols
}

function checkPasswordsLength(passwordInput1: HTMLInputElement, passwordInput2: HTMLInputElement): boolean {
    let flagPasswordLength = false

    const password1 = passwordInput1.value.trim()
    const password2 = passwordInput2.value.trim()

    if (password1.length < 8 || password2.length < 8) {
        passwordInput1.className = 'inputError'
        passwordInput2.className = 'inputError'
        flagPasswordLength = true
    }

    return flagPasswordLength
}