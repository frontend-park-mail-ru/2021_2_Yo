import { FilterData } from '@/types';
import config from '@/config';

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
