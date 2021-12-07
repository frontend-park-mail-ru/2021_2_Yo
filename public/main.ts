import { UrlPathnames } from '@/types';
import Router from '@modules/routing';
import SWInstall from '@modules/swinstaller';
import ErrorPageController from '@error-page/controller';
import MainPageController from '@main-page/controller';
import LoginController from '@login/controller';
import SignupController from '@signup/controller';
import HeaderController from '@header/controller';
import EventPageController from '@event-page/controller';
import EventFormController from '@event-create/controller';
import EventEditFormController from '@event-edit/controller';
import ProfilePageController from './components/ProfilePage/controller';
import '@/main.css';
import * as app from '@/app.hbs';

SWInstall();

document.body.innerHTML = app();
const header = <HTMLElement>document.getElementById('mvc-header');
const content = <HTMLElement>document.getElementById('mvc-content');

const hController = new HeaderController(header);
const mController = new MainPageController(content);
const lController = new LoginController(content);
const sController = new SignupController(content);
const eController = new ErrorPageController(content);
const profileController = new ProfilePageController(content);
const evController = new EventPageController(content);
const evCreateController = new EventFormController(content);
const evEditController = new EventEditFormController(content);

Router.add(UrlPathnames.Main, { header: hController, content: mController });
Router.add(UrlPathnames.Login, { content: lController });
Router.add(UrlPathnames.Signup, { content: sController });
Router.add(UrlPathnames.Error, { header: hController, content: eController });
Router.add(UrlPathnames.Profile, { header: hController, content: profileController });
Router.add(UrlPathnames.Event, { header: hController, content: evController });
Router.add(UrlPathnames.Create, { header: hController, content: evCreateController });
Router.add(UrlPathnames.Edit, { header: hController, content: evEditController });

Router.route();
