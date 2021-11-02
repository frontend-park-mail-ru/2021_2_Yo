import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import SearchPageModel from '@search-page/model';
import SearchPageView from '@search-page/view';
import config from '@/config';

export default class SearchPageController {
    #view: SearchPageView;
    #model: SearchPageModel;

    constructor(parent: HTMLElement) {
        this.#model = new SearchPageModel();
        this.#view = new SearchPageView(parent);
    }

    #customIndexOfCategories(category: string) {
        for (let i = 0; i < config.categories.length; i++) {
            if (config.categories[i].name === category) {
                return i;
            }
        }
        return -1;
    }

    #parseParams() {
        const queryParam = new URL(window.location.href).searchParams?.get('query');
        let query: undefined | string = undefined;
        if (queryParam) {
            query = queryParam;
        }
        const categoryParam = new URL(window.location.href).searchParams?.get('category');
        let category: undefined | number = undefined;
        if (categoryParam) {
            category = this.#customIndexOfCategories(categoryParam);
            if (category === -1) {
                category = undefined;
            }
        }

        const tagsParam = new URL(window.location.href).searchParams?.get('tags');
        let tags = new Array<string>();
        if (tagsParam) {
            tags = tagsParam.split('|');
        } 

        return {category: category, tags: tags, query: query};
    }

    enable() {
        const data = this.#parseParams();
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