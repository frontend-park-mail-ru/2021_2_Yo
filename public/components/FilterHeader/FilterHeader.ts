export default class FilterHeaderComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const header = document.createElement('header');
        header.className = 'fHeader';
        header.innerHTML = `
            <div class="fSubblock">
                <span>Календарь событий</span>
                <img id="calendarimg" class="fImg" src="./img/calendar.png">
            </div>
            <div class="fSubblock">
                <span>Поиск по фильтрам</span>
                <img id="filterimg" class="fImg" src="./img/filter.png">
            </div>
        `;
        this.#parent.innerHTML += header.outerHTML;
    }
}
