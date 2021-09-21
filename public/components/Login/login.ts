import {Request} from "../../modules/request.js";

export class LoginComponent {
    #parent: HTMLElement

    constructor({parent = document.body} = {}) {
        this.#parent = parent
    }

    render() {
        this.#parent.innerHTML = '';

        const background = document.createElement('div')
        background.className = "background"
        this.#parent.appendChild(background)

        const formBackground = document.createElement('div')
        formBackground.className = "authFormBackground"
        background.appendChild(formBackground)

        const authorizeLabel = document.createElement('p')
        authorizeLabel.className = "label"
        authorizeLabel.textContent = "Авторизация"

        const form = document.createElement('form');

        const emailInput = document.createElement('input');
        emailInput.type = 'email'

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password'

        const emailLabel = document.createElement('p')
        emailLabel.textContent = "Email"
        const passwordLabel = document.createElement('p')
        passwordLabel.textContent = "Пароль"

        const submitBtn = document.createElement('input');
        submitBtn.className = "submitBtn"
        submitBtn.type = 'submit';
        submitBtn.value = 'ВОЙТИ';

        form.appendChild(emailLabel)
        form.appendChild(emailInput);
        form.appendChild(passwordLabel)
        form.appendChild(passwordInput);
        form.appendChild(submitBtn);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            const request = new Request()
            request.Post({
                url: '/login', body: {email, password}, callback: (response: Response) => {
                    if (response.status === 200) {
                        const answer = JSON.stringify(response.json())
                        alert(answer)
                        return;
                    }
                    alert('не пришло')
                    return
                }
            })
        })

        formBackground.appendChild(authorizeLabel)
        formBackground.appendChild(form)
    }
}