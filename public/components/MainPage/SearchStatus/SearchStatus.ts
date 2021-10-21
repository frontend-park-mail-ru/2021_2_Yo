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
        const source = `
            {{#with this}}
                <div class="status-wrapper">
                    <div class="status">
                        <span>{{question}}&nbsp;</span>
                        <span class="status__when">{{when}}</span>
                        <span>&nbsp;{{link}}&nbsp;</span>
                        <span class="status__city">{{city}}</span>
                    </div>
                </div>
            {{/with}}
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML = template(status);
    }

    disable() {
        // Скоро тут будет код...
        // Когда апи подправим под рисовку...

        this.#parent.innerHTML = '';
    }
}


