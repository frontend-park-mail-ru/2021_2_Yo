import { UrlPathnames } from './types.js';
import { loginPage, signupPage, errorPage } from './modules/pageloaders.js';
import Router from './modules/routing.js';
import MainPageController from './components/MainPage/controller.js';

let app = document.createElement('div') as HTMLElement;
app.id = 'App';
document.body.innerHTML = app.outerHTML;
app = <HTMLElement>document.getElementById('App');

// Заглушка для роутера
class LoginController {
    enable() {
        loginPage();
    }
    disable() {

    }
}

class SignupController {
    enable() {
        signupPage();
    }
    disable() {

    }
}

class ErrorController {
    enable() {
        errorPage();
    }
    disable() {

    }
}

const mController = new MainPageController(app);
const lController = new LoginController();
const sController = new SignupController();
const eController = new ErrorController();

Router.add(UrlPathnames.Main, mController);
Router.add(UrlPathnames.Login, lController);
Router.add(UrlPathnames.Signup, sController);
Router.add(UrlPathnames.Error, eController);

Router.route();
