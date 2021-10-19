import { anchorsConfig } from '../../config.js';

export default class EventHeaderComponent {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const source = `
            <header class="eHeader">
                {{#each eventAnchors}}
                    <a class="eventAnchor" href="{{href}}">{{name}}</a>
                {{/each}}
            </header>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(anchorsConfig);
    }
}
