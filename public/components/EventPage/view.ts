import {EventData, UrlPathnames} from '../../types.js';

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
                                {{event.city}}
                            </span>
                            <span class ="event-header-text"> > </span>
                            <span class="event-header-text event-header-text_category">{{event.category}}</span>
                        </span>
                        <div class="event-block__event-header-views event-header-views">
                            <img class="event-views-img" src="../../server/img/viewedgrey.png">
                            <span class="event-header-viewed-text">{{event.viewed}}</span>
                        </div>
                    </div>
        
                    <p class="event-block__event-title event-title">{{event.title}}</p>
        
                    <p class="event-block__event-text_header event-text_header">{{event.description}}</p>
        
                    <span class="event-block__event-tags-block event-tags-block">
                        {{#each event.tag}}
                            <a class="event-tags-block__event-tag event-tag">{{this}}</a>
                        {{/each}}
                    </span>
                </div>
        
                <div class="background__event-block event-block">
                    <img class="event-block__photo" src="../../server/img/90s-rave.png">
                </div>
        
                <div class="background__event-block event-block">
                    <p class="event-block__event-text event-text">{{event.text}}</p>
                </div>
        
                <div class="background__event-block event-block">
                    <div class="event-block__event-when">
                        <span class="event-text">Когда: </span>
                        <span class="event-button event-button_orange">{{event.date}}</span>
                    </div>
                    <div class="event-block__event-where">
                        <span class="event-text">Где: </span>
                        <span class="event-button event-button_blue">{{event.geo}}</span>
                    </div>
                </div>
                <div class="background__event-block event-block">
                    <div class="buttons">
                        <a class="buttons__event-button event-button event-button_blue" href="{{editUrl}}">
                            Редактировать мероприятие
                        </a>
                        <a class="buttons__event-button event-button event-button_red">Удалить мероприятие</a>
                    </div>
                </div>
            </div>
        `;

        const template: any = window.Handlebars.compile(source);
        const editUrl = UrlPathnames.Edit;
        this.#parent.innerHTML = template({editUrl, event});
    }

    disable() {
        this.#parent.innerHTML = '';
    }
}
