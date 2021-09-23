import HeaderComponent from "./components/Header/Header.js"
import EventHeaderComponent from "./components/EventsHeader/EventsHeader.js"
import FilterHeaderComponent from "./components/FilterHeader/FilterHeader.js"

declare global {
    interface Window {
        Handlebars: any;
    }
}

const app = document.createElement('div');
app.id = 'App';

const header = new HeaderComponent(app);
const eHeader = new EventHeaderComponent(app);
const fHeader = new FilterHeaderComponent(app);

header.render();
eHeader.render();
fHeader.render();

document.body.innerHTML = app.outerHTML;
