import {UrlPathnames} from '../types.js';
import MainPageComponent from '../components/MainPage/MainPage.js';
import SignupController from '../components/Authorization/SignUp/SignupController.js';
import {getEvents, getUser} from './request/request.js';
import LoginController from '../components/Authorization/Login/LoginController.js';
import route from './routing.js';

const clickHandler = (e: MouseEvent) => {
    const target = e.target as EventTarget;
    if (target instanceof HTMLAnchorElement) {
        e.preventDefault();
        void route(target.href as UrlPathnames);
    }
};

export async function mainPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.innerHTML = '';

    // const events = await getEvents();
    const user = await getUser();
    // const main = new MainPageComponent(app, events, user);
    const main = new MainPageComponent(app, user);
    main.render();
    void getEvents();
    app.addEventListener('click', clickHandler);
}

export function loginPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.removeEventListener('click', clickHandler);
    app.innerHTML = '';
    const loginController = new LoginController(app);
    loginController.enable();
}

export function signupPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.removeEventListener('click', clickHandler);
    app.innerHTML = '';
    const signupController = new SignupController(app);
    signupController.enable();
}

export function errorPage() {
    const app = document.getElementById('App') as HTMLElement;
    app.removeEventListener('click', clickHandler);
    app.innerHTML = `
        <h1>ERROR</h1>
        <h2>Котик, ты шото с урлом напутал, давай больше без приколов<3</h2>
    `;
}
