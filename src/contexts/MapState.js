import React from 'react';

export const MapDefaultState = {
	data: [],
};
export const MapContext = React.createContext(MapDefaultState);
export const MapProvider = MapContext.Provider;
export const MapConsumer = MapContext.Consumer;

export const MapActions = that => ({
    addData() {
        that.setState({
            ...that.state,
            MapState: {
                ...that.state.MapState,
                data: that.state.MapState.data.concat(Math.random() * 10)
            }
        });
    }
});