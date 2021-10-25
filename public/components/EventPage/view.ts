import {EventData} from '../../types.js';

// const event = {
//     id: 1,
//     city: 'Москва',
//     category: 'Тусовка',
//     viewed: 1094,
//     title: 'Невероятная тусовка в Кремле',
//     description: 'Небольшое описание мероприятия. Да, реально крутая тусовка. Да, говорю. Круто будет, говорю, весело.\n' +
//         '         Всем ясно? Тусовка. Тусовка. Тусовка. Тусовка. Тусовка. Тусовка. Этот прямоугольник должен\n' +
//         '         сжиматься/расширяться в зависимости от длины текста (количества строк).',
//     tag: ['Вечеринка', 'Тусовка', 'Party', 'Alcohol'],
//     text: 'But I must explain to you how all this mistaken idea of denouncing\n' +
//         '                pleasure and praising pain was born and I will give you a complete account of the system, ' +
//         'and expound the actual\n' +
//         '                teachings of the great explorer of the truth, the master-builder of human happiness. ' +
//         'No one rejects, dislikes,\n' +
//         '               or avoids pleasure itself, because it is pleasure, but because those who do not know ' +
//         'how to pursue pleasure\n' +
//         '                rationally encounter consequences that are extremely painful. Nor again is ' +
//         'there anyone who loves or pursues or\n' +
//         '               desires to obtain pain of itself, because it is pain, but because occasionally ' +
//         'circumstances occur in which\n' +
//         '                toil and pain can procure him some great pleasure.',
//     date: '28.10.2021',
//     geo: 'Измайлово',
//
// };


export default class EventPageView {
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    render(event: EventData) {
        console.log(event);
        const source = `  
            <div class ="event-background">
                <div class="background__event-block event-block">
                    <div class="event-block__event-header event-header">
                        <span>
                            <span class="event-header__event-header-text event-header-text event-header-text_place">
                                {{city}}
                            </span>
                            <span class ="event-header-text"> > </span>
                            <span class="event-header-text event-header-text_category">{{category}}</span>
                        </span>
                        <div class="event-block__event-header-views event-header-views">
                            <img class="event-views-img" src="../../server/img/viewedgrey.png">
                            <span class="event-header-viewed-text">{{viewed}}</span>
                        </div>
                    </div>
        
                    <p class="event-block__event-title event-title">{{title}}</p>
        
                    <p class="event-block__event-text_header event-text_header">{{description}}</p>
        
                    <span class="event-block__event-tags-block event-tags-block">
                        {{#each tag}}
                            <a class="event-tags-block__event-tag event-tag">{{this}}</a>
                        {{/each}}
                    </span>
                </div>
        
                <div class="background__event-block event-block">
                    <img class="event-block__photo" src="../../server/img/90s-rave.png">
                </div>
        
                <div class="background__event-block event-block">
                    <p class="event-block__event-text event-text">{{text}}</p>
                </div>
        
                <div class="background__event-block event-block">
                    <div class="event-block__event-when">
                        <span class="event-text">Когда: </span>
                        <span class="event-when-text">{{date}}</span>
                    </div>
                    <div class="event-block__event-where">
                        <span class="event-text">Где: </span>
                        <span class="event-where-text">{{geo}}</span>
                    </div>
                </div>
            </div>
        `;

        const template: any = window.Handlebars.compile(source);
        this.#parent.innerHTML = template(event);
    }

    disable() {
        this.#parent.innerHTML = '';
    }
}
