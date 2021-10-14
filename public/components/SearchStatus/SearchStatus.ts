export default class SearchStatusComponent {
    #parent: HTMLElement
    #data: any

    constructor(parent: HTMLElement, data: any) {
        this.#parent = parent;
        this.#data = data;
    }

    render() {
        const source = `
            {{#with this}}
                <div class="status-wrapper">
                    <div class="status">
                        <span>{{question}}</span>
                        <span class="status__when">{{when}}</span>
                        <span>{{link}}</span>
                        <span class="status__city">{{city}}</span>
                    </div>
                </div>
            {{/with}}
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(this.#data);
    }
}

