import { UserData } from '../../../types.js';
import { anchorsConfig } from '../../../config.js';
import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';

export default class HeaderComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        Bus.emit(Events.UserReq, undefined);
        Bus.on(Events.UserReq, this.#userHandle);
        this.#parent = parent;
    }

    #userHandle = ((user: UserData) => {
        this.render(user);
    }).bind(this);

    // rerender(user: UserData) {
    //     const userBlock = document.getElementById('user-block') as HTMLElement;
    //     let source = `
    //         {{#with this}}
    //             <div class="flex">
    //                 <img class="header__user-avatar" src="https://source.boringavatars.com/marble/32/{{name}}">
    //                 <span>{{name}}</span>
    //             </div>
    //             <img class="header-button" src="./img/logout2.0.png">
    //         {{with}}
    //     `;
    //     let template = window.Handlebars.compile(source);
    //     userBlock.innerHTML = template.render(user);

    //     const geoBlock = document.getElementById('geo-block') as HTMLElement;
    //     source = `
    //         {{#with user}}
    //             <div class="flex">
    //                 <img id="geoimg" src="./img/geo2.0.png">
    //                 <span class="header-text_decoration_underline">{{user.geo}}</span>
    //             </div>
    //         {{/with}}
    //     `;
    //     template = window.Handlebars.compile(source);
    //     geoBlock.innerHTML = template.render(user);
    // }

    // render() {
    //     const source = `
    //         <header class="header">
    //             <div class="flex header__content header-text">
    //                 <img class="header__logo" src="./img/logo2.0.png">
    //                 <div id="geo-block"></div>
    //                 <div class="flex header__search">
    //                     <input class="header__search-input" type="text" placeholder="Поиск...">
    //                     <img class="header-button" src="./img/filter2.0.png">
    //                 </div>
    //                 <div class="flex header__calendar">
    //                     <img class="header-button" src="./img/calendar2.0.png">
    //                     <span class="header-text_decoration_underline">Календарь событий</span>
    //                 </div>
    //                 <div id="user-block">
    //                     <div>
    //                         {{#each authAnchors}}
    //                             <a class="header__auth-anchor" href="{{href}}">{{name}}</a>
    //                         {{/each}}
    //                     </div>
    //                 </div>
    //             </div>
    //         </header>
    //     `;
    //     const template = window.Handlebars.compile(source);
    //     const authAnchors = anchorsConfig.authAnchors;
    //     this.#parent.innerHTML = template({authAnchors});
    // }

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
                        <input class="header__search-input" type="text" placeholder="Поиск...">
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
        Bus.off(Events.UserReq, this.#userHandle);
    }
}
