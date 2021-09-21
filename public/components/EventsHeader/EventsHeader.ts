declare global {
    interface Window {
        Handlebars: any;
    }
}
const Handlebars = window.Handlebars;

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
    #parent

    constructor(parent: HTMLElement = document.body) {
        this.#parent = parent;
    }

    render() {
        const header = document.createElement('div');
        header.innerHTML = `
            <div id="eHeader">
                {{#each eventTypes}}
                    <a class="eventAnchor" href="{{this.href}}">{{this.name}}</a>
                {{/each}}
            </div>
        `;
        const source = header.innerHTML;
        const template = Handlebars.compile(source);
        console.log(template);
        header.innerHTML = template(cfg);
        this.#parent.appendChild(header);
    }
}
