import {UrlPathnames} from '../types.js';
import MainPageComponent from '../components/MainPage/MainPage.js';
import LoginPageComponent from '../components/LoginPage&SignupPage/LoginPage.js';
import SignupPageComponent from '../components/LoginPage&SignupPage/SignupPage.js';
import {getEvents, getUser} from './request.js';
import route from './routing.js'

const clickHandler = (e: MouseEvent) => {
    const target = e.target as EventTarget;
    if (target instanceof HTMLAnchorElement) {
        e.preventDefault();
        route(target.href as UrlPathnames);
    }
};

export async function mainPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.innerHTML = '';

    // const events = await getEvents();
    getEvents();
    const user = await getUser();
    // const main = new MainPageComponent(app, events, user);
    const main = new MainPageComponent(app, user);
    main.render();
    app.addEventListener('click', clickHandler);
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
