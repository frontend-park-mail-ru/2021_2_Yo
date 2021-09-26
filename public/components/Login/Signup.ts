export default class SignupComponent {
    #parent: HTMLElement

    constructor({parent = document.body} = {}) {
        this.#parent = parent
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
        `
        const template = window.Handlebars.compile(source)
        this.#parent.innerHTML += template()

        const errorsBlock = document.getElementById('errors') as HTMLElement

        const form = document.getElementById('regForm')
        form?.addEventListener('submit', (event) => {
            event.preventDefault()
            const valid = this.inputsValidation(errorsBlock)
            if (valid) {
                alert('можно отправлять')
            } else {
                alert('нельзя отправлять')
            }
        })
    }

    inputsValidation(errorsBlock: HTMLElement): boolean {
        let valid = true

        errorsBlock.innerHTML = ''

        const flagEmpty = this.checkInputsEmpty()
        const flagPasswordLength = this.checkPasswordsLength()
        const flagIncorrectPasswords = this.checkPasswords()
        const flagForbiddenSymbols = this.checkForbiddenSymbols()

        if (flagEmpty) {
            valid = false
            errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Заполните все поля</p>`)()
        }
        if (flagIncorrectPasswords) {
            valid = false
            errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Пароли не совпадают</p>`)()
        }
        if (flagForbiddenSymbols) {
            valid = false
            errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Запрещенные символы в полях ввода</p>`)()
        }
        if (flagPasswordLength) {
            valid = false
            errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Пароль должен содержать не менее 8 символов</p>`)()
        }

        return valid
    }

    checkInputsEmpty(): boolean {
        let flagEmpty = false

        const nameInput = document.getElementById('nameInput') as HTMLInputElement
        const surnameInput = document.getElementById('surnameInput') as HTMLInputElement
        const emailInput = document.getElementById('emailInput') as HTMLInputElement
        const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement
        const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement

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

    checkPasswords(): boolean {
        let flagIncorrectPasswords = false

        const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement
        const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement

        const password1 = passwordInput1.value.trim()
        const password2 = passwordInput2.value.trim()

        if (password1 !== password2) {
            passwordInput1.className = 'inputError'
            passwordInput2.className = 'inputError'
            flagIncorrectPasswords = true
        }

        return flagIncorrectPasswords
    }

    checkForbiddenSymbols(): boolean {
        let flagForbiddenSymbols = false

        const nameInput = document.getElementById('nameInput') as HTMLInputElement
        const surnameInput = document.getElementById('surnameInput') as HTMLInputElement

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

    checkPasswordsLength(): boolean {
        let flagPasswordLength = false

        const passwordInput1 = document.getElementById('passwordInput1') as HTMLInputElement
        const passwordInput2 = document.getElementById('passwordInput2') as HTMLInputElement

        const password1 = passwordInput1.value.trim()
        const password2 = passwordInput2.value.trim()

        if (password1.length < 8 || password2.length < 8) {
            passwordInput1.className = 'inputError'
            passwordInput2.className = 'inputError'
            flagPasswordLength = true
        }

        return flagPasswordLength
    }
}
