import {UrlPathnames} from './types.js';
import {errorPage} from './modules/pageloaders.js';
import Router from './modules/routing.js';
import MainPageController from './components/MainPage/controller.js';
import LoginController from './components/Authorization/Login/controller.js';
import SignupController from './components/Authorization/SignUp/controller.js';
import EventPageController from './components/EventPage/controller.js';
import EventFormController from './components/EventForm/Create/controller.js';
import EventEditFormController from './components/EventForm/Edit/controller.js';

let app = document.createElement('div') as HTMLElement;
app.id = 'App';
document.body.innerHTML = app.outerHTML;
app = <HTMLElement>document.getElementById('App');

// Заглушка для роутера
// class LoginController {
//     enable() {
//         loginPage();
//     }
//     disable() {

//     }
// }

// class SignupController {
//     enable() {
//         signupPage();
//     }
//     disable() {

//     }
// }

class ErrorController {
    enable() {
        errorPage();
    }

    disable() {

    }
}

const mController = new MainPageController(app);
const lController = new LoginController(app);
const sController = new SignupController(app);
const eController = new ErrorController();
const evController = new EventPageController(app);
const evFController = new EventFormController(app);
const evEdController = new EventEditFormController(app);

Router.add(UrlPathnames.Main, mController);
Router.add(UrlPathnames.Login, lController);
Router.add(UrlPathnames.Signup, sController);
Router.add(UrlPathnames.Error, eController);
Router.add(UrlPathnames.Event, evController);
Router.add(UrlPathnames.Create, evFController);
Router.add(UrlPathnames.Edit, evEdController);

Router.route();
