import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';

export const i32bits = Number.MAX_SAFE_INTEGER;

export function tdf(domain, range = [0.003, 0.03]) {
    const iscale = scaleLinear().domain(domain).range(range);

    console.log('furfles');
    

    return function(datum) {
        return new Date(iscale(datum) * i32bits);
    }
}

export function toDateFactory([ start, end ], range = [new Date(70, 0, 1), new Date(2038, 0, 18)]) {
    const ts = scaleTime().domain(range).range([start, end]);
    console.log('tdf', `ifrom: ${ts.domain()} ito: ${ts.range()}`);
    
    return function(datum) {
        console.log('tdf', datum, ts.invert(datum));
        
        return ts.invert(datum);
    }
}

export function mapToDate(arr, mapFn = null, range = null) {
    let acc = mapFn? Array.from(arr, mapFn) : [...arr];
    
    const toDate = range? toDateFactory(extent(acc), range) : toDateFactory(extent(acc));

    return acc.map((d) => toDate(d));
}
