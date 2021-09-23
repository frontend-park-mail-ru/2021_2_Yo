const cfg = {
    eventTypes: [
    { href : "/#", name : "Выставки" },
    { href : "/#", name : "Концерты" },
    { href : "/#", name : "Вечеринки" },
    { href : "/#", name : "Театр" },
    { href : "/#", name : "Кино" },
    { href : "/#", name : "Экскурсии" },
    { href : "/#", name : "Фестивали" },
    ],
}

export default class EventsHeaderComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement = document.body) {
        this.#parent = parent;
    }

    render() {
        const source = `
            <header class="eHeader">
                {{#each eventTypes}}
                    <a class="eventAnchor" href="{{href}}">{{name}}</a>
                {{/each}}
            </header>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(cfg);
    }
}
