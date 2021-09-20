// import './Header.css'

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
                <img src="./img/logo.png">
                <img src="./img/geo.png">
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