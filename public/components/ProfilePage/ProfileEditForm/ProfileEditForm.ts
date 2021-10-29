export default class ProfileEditForm {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const source = `
            <form>
                <p class="profile-input-label">Имя</p>
                <input class="profile-form-input"/>
                <p class="profile-input-label">Фамилия</p>
                <input class="profile-form-input"/>
                <p class="profile-input-label">Пароль</p>
                <input class="profile-form-input"/>
                <p class="profile-input-label">Подтвердить пароль</p>
                <input class="profile-form-input"/>
            </form>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template();
    }
}