import * as template from '@suggest-list/suggestlist.hbs';
import '@suggest-list/SuggestList.scss';

export default class SuggestList {
    #name: string;
    #parent: HTMLElement;
    #input: HTMLInputElement;
    #list: string[];
    #currentList?: string[];
    #shown: boolean;
    #selected?: number;
    #top: number;
    #bottom: number;

    constructor(name: string, parent: HTMLElement, input: HTMLInputElement, list: Set<string> | Array<string>) {
        this.#name = name;
        this.#parent = parent;
        this.#input = input;
        this.#list = [...list].filter(item => {if (item !== '') return item;});
        this.#input.addEventListener('focus', this.#render);
        this.#input.addEventListener('blur', this.#hide);
        this.#input.addEventListener('input', this.#render);
        this.#shown = false;
        this.#top = 0;
        this.#list.length > 3 ? this.#bottom = 3 : this.#bottom = this.#list.length;
    }

    #autoCompleteMatch(search: string): string[] {
        search = search.trim().toLowerCase();
        if (search === '') {
            return this.#list;
        }

        const reg = new RegExp(search);
        const res = this.#list.filter((item) => {
            if (item.toLowerCase().match(reg)) return item;
        });
        return res;
    }

    #dispatchSuggest(suggest: string) {
        const event = new CustomEvent('suggest', { detail: suggest });
        this.#input.dispatchEvent(event);
    }

    #addEventListeners() {
        const items = this.#parent.getElementsByClassName('suggest-list__li-' + this.#name);
        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', this.#handleClick);
        }
    }

    #handleClick = (e: Event) => {
        const target = <HTMLElement>e.currentTarget;
        const suggest = <string>target.dataset['suggest'];
        this.#input.value = suggest;
        this.#dispatchSuggest(suggest);
    };

    #removeEventListeners() {
        const items = this.#parent.getElementsByClassName('suggest-list__li-' + this.#name);
        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', this.#handleClick);
        }
    }

    #render = () => {
        if (!this.#shown) {
            this.#parent.classList.remove('suggest-list_fade-out');
            this.#shown = true;
            this.#input.addEventListener('keydown', this.#select);
        }
        this.#rerender();
    };

    #select = (e: KeyboardEvent) => {
        if (!this.#currentList) return;
        if (e.code !== 'ArrowUp' && e.code !== 'ArrowDown' && e.code !== 'Enter') return;
        const items = this.#parent.getElementsByClassName('suggest-list__li-' + this.#name);
        if (this.#selected !== undefined) {
            items[this.#selected].classList.remove('suggest-list__li_hover');
        }
        if (e.code === 'Enter') {
            if (this.#selected === undefined) return;
            const suggest = <string>(<HTMLElement>items[this.#selected]).dataset['suggest'];
            this.#input.value = suggest;
            this.#dispatchSuggest(suggest);
            this.#hide();
            return;
        }

        if (e.code === 'ArrowUp') {
            if (this.#selected === undefined || this.#selected === 0) {
                this.#selected = this.#currentList.length - 1; 
                this.#bottom = this.#selected;
                this.#top = this.#currentList.length > 3 ? this.#bottom - 3 : 0;
                if (this.#top !== 0) {
                    const top = (<HTMLElement>items[this.#top]).offsetTop;
                    const list = <HTMLElement>document.getElementById('suggest-list-' + this.#name);
                    list.scrollTop = top;
                }
            } else {
                this.#selected -= 1;
                if (this.#selected < this.#top) {
                    const top = (<HTMLElement>items[this.#top]).offsetHeight;
                    const list = <HTMLElement>document.getElementById('suggest-list-' + this.#name);
                    list.scrollBy(0, -top);

                    this.#top -= 1;
                    this.#bottom -= 1;
                }
            }
        } else {
            if (this.#selected === this.#currentList.length - 1 || this.#selected === undefined) {
                this.#selected = 0;
                this.#top = 0;
                this.#bottom = this.#currentList.length > 3 ? 3 : this.#currentList.length - 1;
                const list = <HTMLElement>document.getElementById('suggest-list-' + this.#name);
                list.scrollTop = 0;
            } else {
                this.#selected += 1;
                if (this.#selected > this.#bottom) {
                    const top = (<HTMLElement>items[this.#top]).offsetHeight;
                    const list = <HTMLElement>document.getElementById('suggest-list-' + this.#name);
                    list.scrollBy(0, top);
                    this.#top += 1;
                    this.#bottom = this.#selected;
                }
            }
        }
        items[this.#selected].classList.add('suggest-list__li_hover');
    };

    #rerender = () => {
        this.#removeEventListeners();
        this.#currentList = this.#autoCompleteMatch(this.#input.value);
        this.#selected = undefined;
        this.#top = 0;
        this.#bottom = this.#currentList.length > 3 ? 3 : this.#currentList.length - 1 ;
        if (this.#currentList.length === 0) {
            this.#dispatchSuggest(this.#input.value.trim());
            this.#hide();
            return;
        }
        this.#parent.innerHTML = template({ list: this.#currentList, name: this.#name });
        let suggest = '';
        if (this.#currentList.length > 0 && this.#input.value.trim() !== '') suggest = this.#currentList[0];
        this.#dispatchSuggest(suggest);
        this.#addEventListeners();
    };

    #hide = () => {
        this.#input.removeEventListener('keydown', this.#select);
        this.#parent.classList.add('suggest-list_fade-out');
        this.#shown = false;
        setTimeout(() => {
            if (this.#shown === true) return;
            this.#parent.innerHTML = '';
            this.#parent.classList.remove('suggest-list_fade-out');
        }, 500);
    };

    disable = () => {
        this.#hide();
        this.#input.removeEventListener('focus', this.#render);
        this.#input.removeEventListener('focusout', this.#hide);
        this.#input.removeEventListener('input', this.#render);
        this.#removeEventListeners();
    };
}
