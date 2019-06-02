import { extent } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import schemes from '../../schemes/categorical';

/*  Copyright (C) 2019 Jose Licio

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

export function load(props) {
    const { data, domain, width, height, scheme, nice, selectX, selectY, selectColor } = props;
    const xDomain = domain ? domain.x : extent(data, selectX);
    const yDomain = domain ? domain.y : extent(data, selectY);
    let { sx, sy } = { sx: scaleLinear(), sy: scaleLinear() };
    sx = sx.domain(xDomain).range([0, width]); //.clamp(true);
    sy = sy.domain(yDomain).range([height, 0]); //.clamp(true);
    
    let colorScale;
    if (selectColor) {
      let colorScheme = scheme? schemes[scheme] : schemes.Category10;
      colorScale = scaleOrdinal(colorScheme).domain(extent(data, selectColor));
    } else {
      colorScale = undefined;
    }

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
        colorScale,
    };
}