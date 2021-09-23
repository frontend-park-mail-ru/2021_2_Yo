export default class HeaderComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement = document.body) {
        this.#parent = parent;
    }

    render() {
        const header = document.createElement('header');
        header.className = 'mainHeader';
        header.innerHTML = `
            <div class="mhContent">
                <div class="geo">
                    <img src="./img/logo.png">
                    <img class="geoimg" src="./img/geo.png">
                    <span>Москва</span>
                </div>
                <input type="text" placeholder="Поиск...">
                <div class="userBox">
                    <img src="https://source.boringavatars.com/marble/60/Валентин">
                    <span>Валентин</span>
                </div>
            </div>
        `;
        this.#parent.innerHTML += header.outerHTML;
    }
}
