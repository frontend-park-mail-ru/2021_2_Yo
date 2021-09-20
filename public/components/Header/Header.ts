

export default class HeaderComponent {
    #parent: HTMLElement

    constructor(parent: HTMLElement = document.body) {
        this.#parent = parent
    }

    render() {
        const header = document.createElement('div');
        header.id = "header";
        header.innerHTML = `
            <div id="headerContent">
                <div id="geo">
                    <img src="./img/logo.png">
                    <img id="geoimg" src="./img/geo.png">
                    <span>Москва</span>
                </div>
                <input type="text" placeholder="Поиск...">
                <div id="userBox">
                    <img src="https://source.boringavatars.com/marble/60/Валентин">
                    <span>Валентин</span>
                </div>
            </div>
        `;
        this.#parent.appendChild(header);
    }
}

// const Header = () => {
//     const header = document.createElement('header')
//     header.innerHTML = '<div>abs</div>'
//     return header
// }

// export default Header