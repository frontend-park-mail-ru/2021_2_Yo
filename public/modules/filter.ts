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

    if (data.category !== undefined) {
        if (res.length > 1) res += '&';
        res += 'category=' + config.categories[data.category].name;
    }

    if ( data.tags && data.tags.length > 0) {
        if (res.length > 1) res += '&';
        res += 'tags=';
        res += data.tags.reduce((prev, curr) => {
            return prev + '|' + curr;
        });
    }

    if (res.length === 1) {
        res = '';
    }
    return res;
}

export function parseParams() {
    const queryParam = new URL(window.location.href).searchParams?.get('query')?.trim();
    let query: undefined | string = undefined;
    if (queryParam) {
        query = queryParam;
    }
    const categoryParam = new URL(window.location.href).searchParams?.get('category');
    let category: undefined | number = undefined;
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

    return {category: category, tags: tags, query: query};
}
