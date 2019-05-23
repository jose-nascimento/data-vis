import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';

export const i32bits = Number.MAX_SAFE_INTEGER;

export function toDateFactory(domain, range = [0.003, 0.03]) {
    const iscale = scaleLinear().domain(domain).range(range);

    console.log('furfles');
    

    return function(datum) {
        return new Date(iscale(datum) * i32bits);
    }
}

export function mapToDate(arr, mapFn = false, range = [0.003, 0.033]) {
    let acc = mapFn? Array.from(arr, mapFn) : [...arr]
    const toDate = toDateFactory(extent(acc), range);

    return acc.map((d) => toDate(d));
}
