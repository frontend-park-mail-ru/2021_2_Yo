import {UrlPathnames} from './types';
import Router from './modules/routing';
import ErrorPageController from './components/ErrorPage/controller';
import MainPageController from './components/MainPage/controller';
import LoginController from './components/Authorization/Login/controller';
import SignupController from './components/Authorization/SignUp/controller';
import HeaderController from './components/Header/controller';
import EventPageController from './components/EventPage/controller';
import EventFormController from './components/EventForm/Create/controller';
import EventEditFormController from './components/EventForm/Edit/controller';

const source = `
    <div id="App">
        <div id="mvc-header"></div>
        <div id="mvc-content"></div>
    </div>
`;
document.body.innerHTML = window.Handlebars.compile(source)();
const header = <HTMLElement>document.getElementById('mvc-header');
const content = <HTMLElement>document.getElementById('mvc-content');

const hController = new HeaderController(header);
const mController = new MainPageController(content);
const lController = new LoginController(content);
const sController = new SignupController(content);
const eController = new ErrorPageController(content);
const evController = new EventPageController(content);
const evCreateController = new EventFormController(content);
const evEditController = new EventEditFormController(content);

Router.add(UrlPathnames.Main, {header: hController, content: mController});
Router.add(UrlPathnames.Login, {content: lController});
Router.add(UrlPathnames.Signup, {content: sController});
Router.add(UrlPathnames.Error, {header: hController, content: eController});
Router.add(UrlPathnames.Event, {header: hController, content: evController});
Router.add(UrlPathnames.Create, {header: hController, content: evCreateController});
Router.add(UrlPathnames.Edit, {header: hController, content: evEditController});

Router.route();
