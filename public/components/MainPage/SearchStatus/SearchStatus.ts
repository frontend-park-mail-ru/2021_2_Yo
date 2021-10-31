import * as template from '@main-page/SearchStatus/template.hbs';

export default class SearchStatusComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const status = {
            question: 'Где потусить',
            when: 'сегодня',
            link: 'в',
            city: 'Москве',
        };
        this.#parent.innerHTML = template(status);
    }

    disable() {
        // Скоро тут будет код...
        // Когда апи подправим под рисовку...

        this.#parent.innerHTML = '';
    }
}


