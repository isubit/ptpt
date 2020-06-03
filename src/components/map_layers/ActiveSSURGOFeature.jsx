// this will outline the active_ssurgo_feature
// import layer, create a component that will return a layer component that includes layer styling and events
import React from 'react';
import { Layer } from './Layer';

export const ActiveSSURGOFeature = props => {
	// what do I need to do now, I have to create the layer styling rules 
	const {
		map,
	} = props;

	// this is the layer object
	const layer = {
		id: 'active_ssurgo_feature',
		type: 'line',
		source: 'active_ssurgo_feature',
		paint: {
			'line-color': '#469AFD',
		},
	};

	return <Layer map={map} layer={layer} />;
};
