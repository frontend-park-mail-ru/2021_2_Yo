import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import SearchPageModel from '@search-page/model';
import SearchPageView from '@search-page/view';
import { parseParams } from '@/modules/filter';

export default class SearchPageController {
    #view: SearchPageView;
    #model: SearchPageModel;

    constructor(parent: HTMLElement) {
        this.#model = new SearchPageModel();
        this.#view = new SearchPageView(parent);
    }


    enable() {
        const data = parseParams();
        this.#model.enable(data);
        this.#view.render();
        this.#view.filter(data);
        Bus.emit(Events.EventsReq);
    }

    disable() {
        this.#view.disable();
        this.#model.disable();
    }
}
