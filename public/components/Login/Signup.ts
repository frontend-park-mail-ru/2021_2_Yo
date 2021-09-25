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
            this.inputsValidation(event, errorsBlock)
        })
    }

    inputsValidation(event: Event, errorsBlock: HTMLElement) {
        event.preventDefault();

        errorsBlock.innerHTML = ''

        const flagEmpty = this.checkInputsEmpty()
        const flagIncorrectPasswords = this.checkPasswords()

        if (flagEmpty) {
            errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Заполните все поля</p>`)()
        }
        if (flagIncorrectPasswords) {
            errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>Пароли не совпадают</p>`)()
        }
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
        } else {
            nameInput.className = 'inputCorrect'
        }

        if (!surname) {
            surnameInput.className = 'inputError'
            flagEmpty = true
        } else {
            surnameInput.className = 'inputCorrect'
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
        } else {
            passwordInput1.className = 'inputCorrect'
            passwordInput2.className = 'inputCorrect'
        }

        return flagIncorrectPasswords
    }
}
