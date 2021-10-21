import { UrlPathnames } from '../types.js';
// import MainPageComponent from '../components/MainPage/MainPage.js';
import LoginPageComponent from '../components/LoginPage&SignupPage/LoginPage.js';
import SignupPageComponent from '../components/LoginPage&SignupPage/SignupPage.js';
// import { getUser } from './request/request.js';
import Router from './routing.js';
import MainPageController from '../components/MainPage/controller.js';

// const clickHandler = (e: MouseEvent) => {
//     const target = e.target as EventTarget;
//     if (target instanceof HTMLAnchorElement) {
//         e.preventDefault();
//         void Router.route(target.href as UrlPathnames);
//     }
// };

export function mainPage() {
    // const app = document.getElementById('App') as HTMLElement;
    // app.innerHTML = '';

    // const user = await getUser();
    // const main = new MainPageComponent(app, user);
    // main.render();
    // void getEvents();
    // app.addEventListener('click', clickHandler);
    const app = document.getElementById('App') as HTMLElement;
    const controller = new MainPageController(app);
}

export function loginPage() {
    const app = document.getElementById('App') as HTMLElement;
    // app.removeEventListener('click', clickHandler);
    app.innerHTML = '';
    const login = new LoginPageComponent(app);
    login.render();
}

export function signupPage() {
    const app = document.getElementById('App') as HTMLElement;
    // app.removeEventListener('click', clickHandler);
    app.innerHTML = '';
    const signup = new SignupPageComponent(app);
    signup.render();
}

export function errorPage() {
    const app = document.getElementById('App') as HTMLElement;
    // app.removeEventListener('click', clickHandler);
    app.innerHTML = `
        <h1>ERROR</h1>
        <h2>Котик, ты шото с урлом напутал, давай больше без приколов<3</h2>
    `;
}
