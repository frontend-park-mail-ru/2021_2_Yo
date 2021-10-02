import route from './modules/routing.js';

const app = document.createElement('div') as HTMLElement;
app.id = 'App';

document.body.innerHTML = app.outerHTML;

window.onpopstate = () => {
    route();
};

route();
