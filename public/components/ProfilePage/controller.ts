import MainPageModel from './model.js';
import ProfilePageView from './view.js';
import UserStore from '../../modules/userstore.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import {UrlPathnames, UserData} from '../../types.js';

export default class ProfilePageController {
    #view: ProfilePageView;

    constructor(parent: HTMLElement) {
        this.#view = new ProfilePageView(parent);
    }

    enable() {
        const stored = {id: '2', name: 'Ksenia', surname: 'Nikitina', description: 'vfeovmorvmb0prfb,vo'} as UserData;
        if (stored) {
            this.#view.render(stored);
        } else {
            Bus.emit(Events.RouteUrl, UrlPathnames.Login);
        }
    }

    disable() {
        this.#view.disable();
    }
}