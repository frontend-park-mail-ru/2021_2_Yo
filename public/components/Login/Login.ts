export default class LoginComponent {
    #parent: HTMLElement

    constructor({parent = document.body} = {}) {
        this.#parent = parent
    }

    render() {
        const source = `
            <div class = 'background'>
                <div class ='authFormBackground' id='authFormBackground'>
                    <p class = 'label'>Авторизация</p>
                    <form id='authForm'>
                        <p>Email</p>
                        <input type='email' id='emailInput'>
                        <p>Пароль</p>
                        <input type='password' id='passwordInput'>
                        <input type='submit' class='submitBtn'>
                        <div id='errors'>
                        </div>
                    </form>
                </div>
            </div>
        `

        const template = window.Handlebars.compile(source)
        this.#parent.innerHTML += template()

        const errorsBlock = document.getElementById('errors') as HTMLElement

        const form = document.getElementById('authForm') as HTMLFormElement
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const valid = this.inputsValidation(event, errorsBlock)
            if (valid) {
                alert('можно отправлять')
            } else {
                alert('нельзя отправлять')
            }
        })
    }

    inputsValidation(event: Event, errorsBlock: HTMLElement): boolean {
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

        if (!password) {
            valid = false
            passwordInput.className = 'inputError'
            errorsBlock.innerHTML += window.Handlebars.compile('<p class="errorP">Введите пароль</p>')()
        } else {
            passwordInput.className = 'inputCorrect'
        }

        return valid
    }
}
