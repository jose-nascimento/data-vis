import React from 'react';

export function addScale(axis, scale) {
    return axis? React.cloneElement(axis, {scale}) : axis;
}