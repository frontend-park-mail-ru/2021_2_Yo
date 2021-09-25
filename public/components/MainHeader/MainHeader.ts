import { UserData } from "../../types.js";

export default class MainHeaderComponent {
    #parent: HTMLElement
    #user: UserData

    constructor(parent: HTMLElement, user: UserData) {
        this.#parent = parent;
        this.#user = user;
    }

    render() {
        const source = `
            <header class="mHeader">
                <div class="mhContent">
                    <div class="geo">
                        <img src="./img/logo.png">
                        <img id="geoimg" src="./img/geo.png">
                        <span class="imgCaption">{{geo}}</span>
                    </div>
                    <input id="searchInput" type="text" placeholder="Поиск...">
                    <div class="userBox">
                        <img src="https://source.boringavatars.com/marble/60/{{name}}">
                        <span class="imgCaption">{{name}}</span>
                    </div>
                </div>
            </header>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(this.#user);
    }
}
