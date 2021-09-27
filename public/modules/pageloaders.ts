import {EventCardData, PageKeys, UserData} from "../types.js";
import MainPageComponent from "../components/MainPage/MainPage.js";
import LoginPageComponent from "../components/LoginPage/LoginPage.js";
import SignupPageComponent from "../components/LoginPage/SignupPage.js";
import {pagesConfig} from "../config.js";
import {Request} from "./request.js";


const clickHandler = (e: MouseEvent) => {
    const target = e.target as EventTarget;
    if (target instanceof HTMLAnchorElement) {
        e.preventDefault();
        window.history.pushState({}, '', target.href);
        const sec = target.dataset.section as PageKeys;
        pagesConfig[sec]();
    }
};

export function mainPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.innerHTML = '';

    // TODO: запросить данные с бека, а не вот это вот все
    const event: EventCardData = {
        imgUrl: '/img/tusa.jpeg',
        viewed: 126,
        name: 'Джуса туса',
        description: 'дискотека это тусовка или просто сборище? 8 лет. Дискотека - это когда есть диджей и в этом деле разбираются все и молодежь и взрослые.'
    };
    const events = Array(9).fill(event);
    // const user: UserData = {id: 1, name: 'Саша', geo: 'Мытищи'};
    let user: undefined | UserData;
    const req = new Request()
    req.getFetch('https://yobmstu.herokuapp.com/user').then(
        ({status, parsedBody}) => {
            console.log(status, " ", parsedBody)
            if (status === 200) {
                // все ок, редирект на главную
                user = {id: 1, name: parsedBody.name, geo: 'Мытищи'};
            } 
            const main = new MainPageComponent(app, events, user);
            main.render();
            app.addEventListener('click', clickHandler);
        }
    )
}

export function loginPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.removeEventListener('click', clickHandler);
    app.innerHTML = '';
    const login = new LoginPageComponent(app);
    login.render();
}

export function signupPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.removeEventListener('click', clickHandler);
    app.innerHTML = '';
    const signup = new SignupPageComponent(app);
    signup.render();
}

export function errorPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.removeEventListener('click', clickHandler);
    app.innerHTML = `
        <h1>ERROR</h1>
        <h2>Котик, ты шото с урлом напутал, давай больше без приколов<3</h2>
    `;
}
