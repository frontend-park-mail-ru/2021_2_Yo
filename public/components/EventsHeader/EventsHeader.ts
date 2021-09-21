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
        const header = document.createElement('div');
        const source = `
            <div id="eHeader">
                {{#each eventTypes}}
                    <a class="eventAnchor" href="{{href}}">{{name}}</a>
                {{/each}}
            </div>
        `;
        const template = window.Handlebars.compile(source);
        header.innerHTML = template(cfg);
        this.#parent.appendChild(header);
    }
}
