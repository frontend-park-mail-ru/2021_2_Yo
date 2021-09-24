export default class LoginComponent {
    #parent: HTMLElement

    constructor({parent = document.body} = {}) {
        this.#parent = parent
    }

    render() {
        const formSource = `
                <p>Email</p>
                <input type='email' id='emailInput'>
                <p>Пароль</p>
                <input type='password' id='passwordInput'>
                <input type='submit' class='submitBtn'>
        `

        const source = `
            <div class = 'background'>
                <div class ='authFormBackground' id='authFormBackground'>
                    <p class = 'label'>Авторизация</p>
                    <form id='authForm'>`
            + formSource +
            `
                    </form>
                </div>
            </div>
        `

        let template = window.Handlebars.compile(source)
        this.#parent.innerHTML += template()


        const form = document.getElementById('authForm')
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('emailInput') as HTMLInputElement
            const passwordInput = document.getElementById('passwordInput') as HTMLInputElement

            const email = emailInput.value.trim()
            const password = passwordInput.value.trim()

            form.innerHTML = formSource

            if (email === '') {
                const error = '<p class="errorP">Введите Email</p>'
                template = window.Handlebars.compile(error)
                form.innerHTML += template()
            }

            if (password === '') {
                const error = '<p class="errorP">Введите пароль</p>'
                template = window.Handlebars.compile(error)
                form.innerHTML += template()
            }
        })
    }
}
