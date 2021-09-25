import HeaderComponent from "./components/MainHeader/MainHeader.js"
import EventHeaderComponent from "./components/EventHeader/EventHeader.js"
import FilterHeaderComponent from "./components/FilterHeader/FilterHeader.js"
import MainPageComponent from "./components/MainPage/MainPage.js";
import { EventCardData, UserData } from "./types.js";

const event: EventCardData = {
    imgUrl: '/img/tusa.jpeg',
    viewed: 126,
    name: 'Джуса туса',
    description: 'дискотека это тусовка или просто сборище? 8 лет. Дискотека - это когда есть диджей и в этом деле разбираются все и молодежь и взрослые.'
};
const events = Array(9).fill(event);
// const user: UserData = {id: 1, name: 'Саша', geo: 'Мытищи'};

const app = document.createElement('div');
app.id = 'App';


const main = new MainPageComponent(app, events);
// const main = new MainPageComponent(app, events, user);
main.render();

document.body.innerHTML = app.outerHTML;
