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

export default class EventHeaderComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement) {
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
