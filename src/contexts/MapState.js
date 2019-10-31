import React from 'react';
import geojsonhint from '@mapbox/geojsonhint';

export const MapDefaultState = {
	data: [],
};
export const MapContext = React.createContext(MapDefaultState);
export const MapProvider = MapContext.Provider;
export const MapConsumer = MapContext.Consumer;

export const MapActions = that => ({
    addData(geojson) {
        const errors = geojsonhint.hint(geojson);
        let value;
        if (typeof geojson == 'string') {
            try {
                value = JSON.parse(geojson);
            } catch(e) {
                console.warn('GeoJSON was not parseable.');
            }
        } else {
            value = geojson
        }
        if (!errors || errors.length == 0) {
            that.setState({
                MapState: {
                    ...that.state.MapState,
                    data: that.state.MapState.data.concat(value)
                }
            });
        }
    }
});