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
                        <div style='padding-bottom: 42px'>
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

        const errorsPlace = document.getElementById('errors') as HTMLElement

        const form = document.getElementById('regForm')
        form?.addEventListener('submit', (e) => {
            e.preventDefault();

            errorsPlace.innerHTML = ''

            let flagEmpty: boolean = false
            let flagIncorrectPasswords: boolean = false

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
                nameInput.style.border = '1px solid red'
                flagEmpty = true
            } else {
                nameInput.style.border = '1px solid green'
            }

            if (!surname) {
                surnameInput.style.border = '1px solid red'
                flagEmpty = true
            } else {
                surnameInput.style.border = '1px solid green'
            }

            if (!email) {
                emailInput.style.border = '1px solid red'
                flagEmpty = true
            } else {
                emailInput.style.border = '1px solid green'
            }

            if (!password1) {
                passwordInput1.style.border = '1px solid red'
                flagEmpty = true
            }

            if (!password2) {
                passwordInput2.style.border = '1px solid red'
                flagEmpty = true
            }

            if (password1 !== password2) {
                passwordInput1.style.border = '1px solid red'
                passwordInput2.style.border = '1px solid red'
                flagIncorrectPasswords = true
            }

            if (flagEmpty) {
                errorsPlace.innerHTML += window.Handlebars.compile(`<p class='errorP'>Заполните все поля</p>`)()
            }
            if (flagIncorrectPasswords) {
                errorsPlace.innerHTML += window.Handlebars.compile(`<p class='errorP'>Пароли не совпадают</p>`)()
            }
        })
    }
}
