import { UserData } from "../../types.js";
import { anchorsConfig } from "../../config.js";

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
                        {{#if user}}'
                            <img id="geoimg" src="./img/geo.png">
                            <span class="imgCaption">{{user.geo}}</span>
                        {{/if}}
                    </div>
                    <input id="searchInput" type="text" placeholder="Поиск...">
                    {{#if user}}
                        <div class="userBox">
                            <img src="https://source.boringavatars.com/marble/60/{{user.name}}">
                            <span class="rightSideText">{{user.name}}</span>
                        </div>
                    {{else}}
                        <div class="authBox">
                            {{#each authAnchors}}
                                <a class="authAnchor" href="{{href}}" data-section="{{key}}">{{name}}</a>
                            {{/each}}
                        </div>
                    {{/if}}
                </div>
            </header>
        `;
        const template = window.Handlebars.compile(source);
        const user = this.#user;
        const authAnchors = anchorsConfig.authAnchors;
        this.#parent.innerHTML += template({user, authAnchors});
    }
}
