import * as template from '@error-page/errorpage.hbs';
import '@error-page/ErrorPage.scss';

export default class ErrorPageView {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = template();
    }

    disable() {
        this.#parent.innerHTML = '';
    }
}
