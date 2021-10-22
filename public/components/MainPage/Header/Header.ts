import { UserData } from '../../../types.js';
import { anchorsConfig } from '../../../config.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class HeaderComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.emit(Events.UserReq, undefined);
        Bus.on(Events.UserRes, this.#userHandle);
        this.#parent = parent;
    }


    #userHandle = ((user: UserData) => {
        this.render(user);
    }).bind(this);


    render(data?: UserData) {
        const source = `
            <header class="header">
                <div class="flex header__content header-text">
                    <img class="header__logo" src="./img/logo2.0.png">
                    {{#if user}}
                        <div id="geo-block">
                            <div class="flex">
                                <img id="geoimg" src="./img/geo2.0.png">
                                <span class="header-text_decoration_underline">{{user.geo}}</span>
                            </div>
                        </div>
                    {{/if}}
                    <div class="flex header__search">
                        <input class="header__search-input" type="text" placeholder="Найдем тусу под ваши вкусы...">
                        <img class="header-button" src="./img/filter2.0.png">
                    </div>
                    <div class="flex header__calendar">
                        <img class="header-button" src="./img/calendar2.0.png">
                        <span class="header-text_decoration_underline">Календарь событий</span>
                    </div>
                    <div id="user-block">
                        {{#if user}}
                            <div class="flex">
                                <img class="header__user-avatar" src="https://source.boringavatars.com/marble/32/{{user.name}}">
                                <span>{{user.name}}</span>
                            </div>
                            <img class="header-button" src="./img/logout2.0.png">
                        {{else}}
                            <div>
                                {{#each authAnchors}}
                                    <a class="header__auth-anchor" href="{{href}}">{{name}}</a>
                                {{/each}}
                            </div>
                        {{/if}}
                    </div>
                </div>
            </header>
        `;
        const template = window.Handlebars.compile(source);
        const authAnchors = anchorsConfig.authAnchors;
        this.#parent.innerHTML = template({authAnchors, data});
    }

    disable() {
        Bus.off(Events.UserRes, this.#userHandle);
        this.#parent.innerHTML = '';
    }
}
