// import {Request} from "../../modules/request.js";

export class LoginComponent {
    #parent: HTMLElement

    constructor({parent = document.body} = {}) {
        this.#parent = parent
    }

    render() {
        // form.addEventListener('submit', (e) => {
        //     e.preventDefault();
        //     const email = emailInput.value.trim();
        //     const password = passwordInput.value.trim();
        //
        //     // const request = new Request()
        //     // request.Post({
        //     //     url: '/login', body: {email, password}, callback: (response: Response) => {
        //     //         if (response.status === 200) {
        //     //             const answer = JSON.stringify(response.json())
        //     //             alert(answer)
        //     //             return;
        //     //         }
        //     //         alert('не пришло')
        //     //         return
        //     //     }
        //     // })
        // })

        const source =`
            <div class = "background">
                <div class ="authFormBackground">
                    <p class = "label">Авторизация</p>
                    <form>
                        <p>Email</p>
                        <input type="email">
                        <p>Пароль</p>
                        <input type="password">
                        <input type="submit" class="submitBtn">
                    </form>
                </div>
            </div>
        `
        const template = window.Handlebars.compile(source)
        this.#parent.innerHTML += template()
    }
}