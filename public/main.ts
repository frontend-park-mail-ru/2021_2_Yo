import { menuPage } from "./modules/pageloaders.js";

const app = document.createElement('div') as HTMLElement;
app.id = 'App';

document.body.innerHTML = app.outerHTML;

menuPage();

window.onpopstate = () => {
    menuPage();
};
