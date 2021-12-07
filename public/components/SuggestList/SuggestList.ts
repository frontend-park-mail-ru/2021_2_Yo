import * as template from '@suggest-list/suggestlist.hbs';
import '@suggest-list/SuggestList.css'

export default class SuggestList {
    #parent: HTMLElement;
    #input: HTMLInputElement;
    #list: [];

    constructor(parent: HTMLElement, input: HTMLInputElement, list: []) {
        this.#parent = parent;
        this.#input = input;
        this.#list = list;
        this.#input.addEventListener('focus', this.#enable)
        this.#input.addEventListener('focusout', this.#disable)
    }

    #enable = () => {
        this.#parent = template();
    };

    #disable = () => {

    }
}
