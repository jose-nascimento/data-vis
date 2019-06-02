import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';

/*  Copyright (C) 2019 Jose Licio

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

export const i32bits = Number.MAX_SAFE_INTEGER;

export function tdf(domain, range = [0.003, 0.03]) {
    const iscale = scaleLinear().domain(domain).range(range);    

    return function(datum) {
        return new Date(iscale(datum) * i32bits);
    }
}

export function toDateFactory([ start, end ], range = [new Date(70, 0, 1), new Date(2038, 0, 18)]) {
    const ts = scaleTime().domain(range).range([start, end]);
    
    return function(datum) {
        
        return ts.invert(datum);
    }
}

export function mapToDate(arr, mapFn = null, range = null) {
    let acc = mapFn? Array.from(arr, mapFn) : [...arr];
    
    const toDate = range? toDateFactory(extent(acc), range) : toDateFactory(extent(acc));

    return acc.map((d) => toDate(d));
}

export function load(props) {
    const { data, domain, width, height, nice, selectX, selectY } = props;
    const xDomain = domain ? domain.x : extent(data, selectX);
    const yDomain = domain ? domain.y : extent(data, selectY);
    let { sx, sy } = { sx: scaleTime(), sy: scaleLinear() };
    sx = sx.domain(xDomain).range([0, width]); //.clamp(true);
    sy = sy.domain(yDomain).range([height, 0]); //.clamp(true);

    if (nice) {
      sx = sx.nice();
      sy = sy.nice();
    }

    let datapoints = props.data.map(d => ({
      x: sx(selectX(d)),
      y: sy(selectY(d)),
    }));

    return {
        datapoints,
        scale: { x: sx, y: sy },
        domain: { x: xDomain, y: yDomain },
    };
}
