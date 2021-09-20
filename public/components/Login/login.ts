export class LoginComponent {
    #parent

    constructor({parent = document.body} = {}) {
        this.#parent = parent
    }

    render() {
        this.#parent.innerHTML = '';

        const background = document.createElement('div')
        background.className = "background"
        this.#parent.appendChild(background)

        const formBackground = document.createElement('div')
        formBackground.className = "formBackground"
        background.appendChild(formBackground)

        const authorizeLabel = document.createElement('p')
        authorizeLabel.className = "authLabel"
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

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({email, password})
            }).then(response => {
                    if (response.status === 200) {
                        alert('пришло');
                        return;
                    }
                    alert('не пришло');
                }
            );
        })

        formBackground.appendChild(authorizeLabel)
        formBackground.appendChild(form)
    }
}