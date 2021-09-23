export default class FilterHeaderComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement = document.body) {
        this.#parent = parent;
    }

    render() {
        const header = document.createElement('header');
        header.className = 'fHeader';
        header.innerHTML = `
            <div class="fSubblock">
                <span>Календарь событий</span>
                <img class="fImg" src="./img/calendar.png">
            </div>
            <div class="fSubblock">
                <span>Поиск по фильтрам</span>
                <img class="fImg" src="./img/filter.png">
            </div>
        `;
        this.#parent.innerHTML += header.outerHTML;
    }
}
