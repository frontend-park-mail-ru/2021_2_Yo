export default class SignupComponent {
    #parent: HTMLElement

    constructor({parent = document.body} = {}) {
        this.#parent = parent
    }

    render() {
        const source = `
            <div class = "signupBackground">
                <div class = "signupFormBackground">
                    <p class="label">Регистрация</p>
                    <div style="padding-bottom: 42px">
                        <p class="smallerLabel">Личные данные</p>
                        <p>Имя</p>
                        <input>
                        <p>Фамилия</p>
                        <input>
                    </div>
                    <div>
                        <p class="smallerLabel">Данные для входа в аккаунт</p>
                        <p>Email</p>
                        <input type="email">
                        <p>Пароль</p>
                        <input type="password">
                        <p>Пароль еще раз</p>
                        <input type="password">
                        <input class="submitBtn" type="submit" value="ПОДТВЕРДИТЬ">
                    </div>
                </div>
            </div>
        `
        const template = window.Handlebars.compile(source)
        this.#parent.innerHTML += template()
    }
}