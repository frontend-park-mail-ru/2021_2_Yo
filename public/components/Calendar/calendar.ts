import * as template from '@calendar/calendar.hbs';
import '@calendar/Calendar.css';

const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];

export default class Calendar {
    #date: Date;
    #lastDay?: number;
    #prevMonthLastDay?: number;
    #firstDayIndex?: number;
    #lastDayIndex?: number;
    #nextMonthDays?: number;
    #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;

        this.#date = new Date();
        this.#date.setDate(1);

        this.#calculateDates();
    }

    #calculateDates() {
        const lastDayDate = new Date(this.#date.getFullYear(), this.#date.getMonth() + 1, 0);
        this.#lastDay = lastDayDate.getDate();

        const prevLastDayDate = new Date(this.#date.getFullYear(), this.#date.getMonth(), 0);
        this.#prevMonthLastDay = prevLastDayDate.getDate();

        if (this.#date.getDay() === 0) {
            this.#firstDayIndex = 6;
        } else {
            this.#firstDayIndex = this.#date.getDay() - 1;
        }

        const lastDayIndexDate = new Date(this.#date.getFullYear(), this.#date.getMonth() + 1, 0);
        if (lastDayIndexDate.getDay() === 0) {
            this.#lastDayIndex = 6;
        } else {
            this.#lastDayIndex = lastDayIndexDate.getDay() - 1;
        }

        this.#nextMonthDays = 7 - this.#lastDayIndex - 1;
    }

    render() {
        this.#parent.innerHTML += template();
        this.#renderDates();
    }

    #renderDates() {
        this.#calculateDates();

        const currentMonth = <HTMLSpanElement>document.getElementById('currentMonth');
        currentMonth.textContent = months[this.#date.getMonth()];
        const currentYear = <HTMLSpanElement>document.getElementById('currentYear');
        currentYear.textContent = this.#date.getFullYear().toString();

        const prev = <HTMLElement>document.getElementById('prev');
        if (this.#date.getMonth() === new Date().getMonth()) {
            prev.style.setProperty('visibility', 'hidden');
        } else {
            prev.style.removeProperty('visibility');
        }

        let days = '';

        for (let i = <number>this.#firstDayIndex; i > 0; i--) {
            days += `<div class="prev-date" data-month="${this.#date.getMonth() - 1}">
                        ${<number>this.#prevMonthLastDay - i + 1}
                    </div>`;
        }

        for (let i = 1; i <= <number>this.#lastDay; i++) {
            if (i === new Date().getDate() && this.#date.getMonth() === new Date().getMonth()) {
                days += `<div class="today" data-month="${this.#date.getMonth()}">${i}</div>`;
            } else {
                days += `<div data-month="${this.#date.getMonth()}">${i}</div>`;
            }
        }

        for (let i = 1; i <= <number>this.#nextMonthDays; i++) {
            days += `<div class="next-date" data-month="${this.#date.getMonth() + 1}">${i}</div>`;
        }

        const monthDays = <HTMLElement>document.getElementById('monthDays');
        monthDays.innerHTML = days;

        this.#addListeners();
    }

    disable(e: Event) {
        e.preventDefault();
        this.#parent.innerHTML = '';
        this.#removeListeners();
    }

    #addListeners() {
        const prevMonthBtn = <HTMLElement>document.getElementById('prev');
        const nextMonthBtn = <HTMLElement>document.getElementById('next');

        prevMonthBtn.addEventListener('click', this.#renderPrevMonth);
        nextMonthBtn.addEventListener('click', this.#renderNextMonth);

        const monthDays = <HTMLElement>document.getElementById('monthDays');
        for (let i = 0; i < monthDays.children.length; i++) {
            const child = <HTMLElement>monthDays.children[i];
            child.addEventListener('click', this.#writeDate.bind(this,
                parseInt(<string>child.textContent),
                parseInt(<string>child.dataset.month), child));
        }

        const submitButton = <HTMLElement>document.getElementById('submit');
        submitButton.addEventListener('click', this.disable.bind(this));

        const calendarBg = <HTMLElement>document.getElementById('calendarBg');
        calendarBg.addEventListener('click', this.disable.bind(this));
    }

    #removeListeners() {
        const prevMonthBtn = <HTMLElement>document.getElementById('prev');
        const nextMonthBtn = <HTMLElement>document.getElementById('next');

        if (prevMonthBtn) {
            prevMonthBtn.removeEventListener('click', this.#renderPrevMonth);
        }
        if (nextMonthBtn) {
            nextMonthBtn.removeEventListener('click', this.#renderNextMonth);
        }

        const monthDays = <HTMLElement>document.getElementById('monthDays');
        if (monthDays) {
            for (let i = 0; i < monthDays.children.length; i++) {
                const child = <HTMLElement>monthDays.children[i];
                child.removeEventListener('click', this.#writeDate.bind(this,
                    parseInt(<string>child.textContent),
                    parseInt(<string>child.dataset.month), child));
            }
        }

        const submitButton = <HTMLElement>document.getElementById('submit');
        if (submitButton) {
            submitButton.removeEventListener('click', this.disable.bind(this));
        }

        const calendarBg = <HTMLElement>document.getElementById('calendarBg');
        if (calendarBg) {
            calendarBg.removeEventListener('click', this.disable.bind(this));
        }
    }

    #renderPrevMonth = () => {
        this.#date.setMonth(this.#date.getMonth() - 1);
        this.#renderDates();
    };

    #writeDate(day: number, month: number, dateCell: HTMLElement) {
        const monthDays = <HTMLElement>document.getElementById('monthDays');
        for (let i = 0; i < monthDays.children.length; i++) {
            const child = <HTMLElement>monthDays.children[i];
            if (child.classList.contains('clicked')) {
                child.classList.remove('clicked');
            }
        }

        dateCell.classList.add('clicked');
        const dateInput = <HTMLInputElement>document.getElementById('dateInput');
        dateInput.value = new Date(this.#date.getFullYear(), month, day).toLocaleDateString('ru-RU');
    }

    #renderNextMonth = () => {
        this.#date.setMonth(this.#date.getMonth() + 1);
        this.#renderDates();
    };
}
