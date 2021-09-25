import { UserData } from "../../types.js";

export default class MainHeaderComponent {
    #parent: HTMLElement
    #user: UserData | undefined

    constructor(parent: HTMLElement, user?: UserData) {
        this.#parent = parent;
        this.#user = user;
    }

    render() {
        const source = `
            <header class="mHeader">
                <div class="mhContent">
                    <div class="geo">
                        <img src="./img/logo.png">
                        {{#if this}}
                            <img id="geoimg" src="./img/geo.png">
                            <span class="imgCaption">{{geo}}</span>
                        {{/if}}
                    </div>
                    <input id="searchInput" type="text" placeholder="Поиск...">
                    {{#if this}}
                        <div class="userBox">
                            <img src="https://source.boringavatars.com/marble/60/{{name}}">
                            <span class="rightSideText">{{name}}</span>
                        </div>
                    {{else}}
                        <div class="authBox">
                            <a class="authAnchor" href="/login">Войти</a>
                            <a class="authAnchor rightSideText" href="/signup">Регистрация</a>
                        </div>
                    {{/if}}
                </div>
            </header>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(this.#user);
    }
}
