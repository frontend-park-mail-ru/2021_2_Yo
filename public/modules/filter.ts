import { FilterData } from '@/types';
import config from '@/config';

function customIndexOfCategories(category: string) {
    for (let i = 0; i < config.categories.length; i++) {
        if (config.categories[i].name === category) {
            return i;
        }
    }
    return -1;
}

export function filterToUrl (data: FilterData) {
    let res = '?';

    if (data.query && data.query !== '') {
        res += 'query=' + data.query;
    }

    if (data.category !== undefined && data.category < config.categories.length) {
        if (res.length > 1) res += '&';
        res += 'category=' + config.categories[data.category].name;
    }

    if (data.tags && data.tags.length > 0) {
        if (res.length > 1) res += '&';
        res += 'tags=';
        res += data.tags.reduce((prev, curr) => {
            return prev + '|' + curr;
        });
    }

    if (data.date && data.date !== '') {
        if (res.length > 1) res += '&';
        res += 'date=' + data.date;
    }

    if (data.city && data.city !== '') {
        if (res.length > 1) res += '&';
        res += 'city=' + data.city;
    }

    if (res.length === 1) {
        res = '';
    }
    return encodeURI(res);
}

export function parseParams() {
    const queryParam = new URL(window.location.href).searchParams?.get('query')?.trim();
    let query: undefined | string;
    if (queryParam) {
        query = queryParam;
    }
    const categoryParam = new URL(window.location.href).searchParams?.get('category');
    let category: undefined | number;
    if (categoryParam) {
        category = customIndexOfCategories(categoryParam);
        if (category === -1) {
            category = undefined;
        }
    }

    const tagsParam = new URL(window.location.href).searchParams?.get('tags');
    let tags = new Array<string>();
    if (tagsParam) {
        tags = tagsParam.split('|');
        tags = tags.map(tag => tag.trim());
        tags = tags.filter(tag => tag !== '');
    }

    const dateParam = new URL(window.location.href).searchParams?.get('date');
    let date: undefined | string;
    if (dateParam) date = dateParam;

    const cityParam = new URL(window.location.href).searchParams?.get('city');
    let city: undefined | string;
    if (cityParam) city = cityParam;

    return { query, category, tags, date, city };
}
