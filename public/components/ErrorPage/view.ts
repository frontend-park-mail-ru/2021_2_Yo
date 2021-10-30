export default class ErrorPageView {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const source = `
            <h1>ERROR</h1>
            <h2>Котик, ты шото с урлом напутал, давай больше без приколов<3</h2>
        `;
        this.#parent.innerHTML = window.Handlebars.compile(source)();
    }

    disable() {
        this.#parent.innerHTML = '';
    }
}
