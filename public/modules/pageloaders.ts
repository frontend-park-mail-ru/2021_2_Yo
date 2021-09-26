import { EventCardData, PageKeys } from "../types.js";
import MainPageComponent from "../components/MainPage/MainPage.js";
import LoginPageComponent from "../components/LoginPage/LoginPage.js";
import SignupPageComponent from "../components/LoginPage/SignupPage.js";
import { anchorsConfig, pagesConfig } from "../config.js";

function clickHandler() {
    const app = document.getElementById('App') as HTMLElement;
    app.addEventListener('click', e => {
        const target = e.target as EventTarget;
        if (target instanceof HTMLAnchorElement) {
            e.preventDefault();
            const sec = target.dataset.section as PageKeys;
            window.history.pushState({}, '', target.href);
            pagesConfig[sec]();
        }
    });
}

export function menuPage() {
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

    const main = new MainPageComponent(app, events);
    main.render();

    document.body.innerHTML = app.outerHTML;

    clickHandler();
}

export function loginPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.innerHTML = '';
    const login = new LoginPageComponent(app);
    login.render();

    document.body.innerHTML = app.outerHTML;
}

export function signupPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.innerHTML = '';
    const signup = new SignupPageComponent(app);
    signup.render();

    document.body.innerHTML = app.outerHTML;
}
