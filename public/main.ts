import { UrlPathnames } from './types.js';
import Router from './modules/routing.js';
import ErrorPageController from './components/ErrorPage/controller.js';
import MainPageController from './components/MainPage/controller.js';
import LoginController from './components/Authorization/Login/LoginController.js';
import SignupController from './components/Authorization/SignUp/SignupController.js';
import HeaderController from './components/Header/controller.js';
import SearchPageController from './components/SearchPage/controller.js';

const source = `
    <div id="App">
        <div id="mvc-header"></div>
        <div id="mvc-content"></div>
    </div>
`;
document.body.innerHTML = window.Handlebars.compile(source)();
const header = <HTMLElement>document.getElementById('mvc-header');
const content = <HTMLElement>document.getElementById('mvc-content');

const headerController = new HeaderController(header);
const mainController = new MainPageController(content);
const loginController = new LoginController(content);
const signupController = new SignupController(content);
const searchController = new SearchPageController(content);
const errorController = new ErrorPageController(content);

Router.add(UrlPathnames.Main, {header: headerController, content: mainController});
Router.add(UrlPathnames.Login, {content: loginController});
Router.add(UrlPathnames.Signup, {content: signupController});
Router.add(UrlPathnames.Search, {header: headerController, content: searchController});
Router.add(UrlPathnames.Error, {header: headerController, content: errorController });

Router.route();
