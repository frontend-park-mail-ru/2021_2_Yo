import HeaderComponent from "./components/Header/Header.js"
import EventHeaderComponent from "./components/EventsHeader/EventsHeader.js"
import FilterHeaderComponent from "./components/FilterHeader/FilterHeader.js"

declare global {
    interface Window {
        Handlebars: any;
    }
}

const header = new HeaderComponent();
const eHeader = new EventHeaderComponent();

header.render();
eHeader.render();
