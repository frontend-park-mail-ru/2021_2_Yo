export type EventCardData = {
    imgUrl: string;
    viewed: number;
    name: string;
    description: string;
}

export default class EventCardComponent {
    #parent: HTMLElement
    #data: EventCardData

    constructor(parent: HTMLElement, data: EventCardData) {
        this.#parent = parent;
        this.#data = data;
    }

    render() {
        const source = `
            <div class="eventCard">
                <div class="cover">
                    <img class="eventBG" src="{{imgUrl}}">
                    <div class="eventName">{{name}}</div>
                    <div class="eventViews">
                        <img class="eventViewsImg" src="./img/viewed.png">
                        <span>{{viewed}}</span>
                    </div>
                </div>
                <div class="description">{{description}}</div>
            </div>
        `;
        const template = window.Handlebars.compile(source);
        this.#parent.innerHTML += template(this.#data);
    }
}
