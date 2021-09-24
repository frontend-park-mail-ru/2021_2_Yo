export default class HeaderComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const header = document.createElement('header');
        header.className = 'mHeader';
        header.innerHTML = `
            <div class="mhContent">
                <div class="geo">
                    <img src="./img/logo.png">
                    <img id="geoimg" src="./img/geo.png">
                    <span class="imgCaption">Москва</span>
                </div>
                <input id="searchInput" type="text" placeholder="Поиск...">
                <div class="userBox">
                    <img src="https://source.boringavatars.com/marble/60/Валентин">
                    <span class="imgCaption">Валентин</span>
                </div>
            </div>
        `;
        this.#parent.innerHTML += header.outerHTML;
    }
}
