import HeaderComponent from "./components/Header/Header.js"
import EventHeaderComponent from "./components/EventsHeader/EventsHeader.js"

declare global {
    interface Window {
        Handlebars: any;
    }
}

const app = document.createElement('div');
app.id = 'App';

const header = new HeaderComponent(app);
const eHeader = new EventHeaderComponent(app);

header.render();
eHeader.render();

document.body.innerHTML = app.outerHTML;