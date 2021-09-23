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
        const card = document.createElement('div');
        card.className = "eventCard";
        const source = `
            <div class="cover">
                <img src="{{imgUrl}}">
                <div class="eventName">{{name}}</div>
                <div class="eventViews">
                    <img src="./img/viewed.png">
                    <span>{{viewed}}</span>
                </div>
            </div>
            <div class="description">{{description}}</div>
        `;
        const template = window.Handlebars.compile(source);
        card.innerHTML = template(this.#data);
        this.#parent.innerHTML += card.outerHTML;
    }
}