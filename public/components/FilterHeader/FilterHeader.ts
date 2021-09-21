export default class FilterHeaderComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement = document.body) {
        this.#parent = parent;
    }

    render() {
        const header = document.createElement('div');
        header.id = "fHeader";
        header.innerHTML = `
            <div id="calendar">
                <span>Календарь событий</span>
                <img src="./img/calendar.png">
            </div>
            <div id="filter">
                <span>Поиск по фильтрам</span>
                <img src="./img/filter.png">
            </div>
        `;
        this.#parent.appendChild(header);
    }
}
