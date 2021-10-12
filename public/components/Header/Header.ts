import { UserData } from '../../types.js';
import { anchorsConfig } from '../../config.js';

export default class HeaderComponent {
    #parent: HTMLElement
    #user: UserData | undefined

    constructor(parent: HTMLElement, user?: UserData) {
        this.#parent = parent;
        this.#user = user;
    }

    render() {
        const source = `
            <header class="header">
                <div class="flex header__content text">
                    <img class="header__logo" src="./img/logo2.0.png">
                    {{#if user}}
                        <div>
                            <img id="geoimg" src="./img/geo2.0.png">
                            <span class="text_decoration_underline">{{user.geo}}</span>
                        </div>
                    {{/if}}
                    <div class="flex header__search">
                        <input class="header__search-input" id="searchInput" type="text" placeholder="Поиск...">
                        <img src="./img/filter2.0.png">
                    </div>
                    <div class="flex header__calendar">
                        <img src="./img/calendar2.0.png">
                        <span class="text_decoration_underline">Календарь событий</span>
                    </div>
                    {{#if user}}
                        <div>
                            <img class="header_user-avatar" src="https://source.boringavatars.com/marble/32/{{user.name}}">
                            <span>{{user.name}}</span>
                        </div>
                        <img src="./img/logout2.0.png">
                    {{else}}
                        <div class="header__auth">
                            {{#each authAnchors}}
                                <a class="header__auth-anchor" href="{{href}}">{{name}}</a>
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