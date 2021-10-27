import EventList from './EventList/EventList.js';

export default class SearchBoard {
    #parent: HTMLElement;
    #list?: EventList;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render() {
        const eventList = `
            <div class="event-li">
                <div class="event-li__img bg-img-wrapper">
                    <img class="bg-img" src="/img/tusa2.0.png">
                </div>
                <div class ="event-li__content">
                    <span class="event-li__title">Че происходит - непонятно...</span>
                    <div class="event-li__description">
                        Небольшое описание мероприятия. Да, реально крутая тусовка. Да, говорю. 
                        Круто будет, говорю, весело. Всем ясно? Тусовка. Тусовка. Тусовка. 
                        Тусовка. Тусовка. Тусовка.Я только хз, как правильно расположить 
                        “Когда” и “Где” - сразу после этого текста или внизу блока?
                    </div>
                    <div class="event-li__info event-li__description">
                        <div class="event-li__description">
                            <span>Когда:&nbsp;</span>
                            <span class="text_date">28.06.2021</span>
                            <span>Где:&nbsp;</span>
                            <span class="text_geo">Ул. Пушкина, д. 182</span>
                        </div>
                        <div class="event-li__viewed">
                            <img class="event-li__viewed-img" src="/img/viewed2.png">
                            <span>1528</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        window.Handlebars.registerPartial('event', eventList);

        const source = `
            <div class="search-bar">
                <input class="search-bar__input border-box_color_gray" placeholder="Например: отвисная и отвязная..."></input>
                <div class="search-bar__geo border-box_color_gray text_geo">Москва</div>
            </div>
            <div id="events-list">
            {{#each events}}
                {{> event this}}
            {{/each}}
            </div>
        `;
        this.#parent.innerHTML = window.Handlebars.compile(source)({events: [1, 1, 1, 1, 1, 1]});

        const list = <HTMLElement>document.getElementById('events-list');
        this.#list = new EventList(list);
        this.#list.render();
    }

    disable() {
        this.#list?.disable();
        this.#parent.innerHTML = '';
    }
}
