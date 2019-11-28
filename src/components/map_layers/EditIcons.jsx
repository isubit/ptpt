import React from 'react';
import { Layer } from './Layer';

export const EditIcons = props => {
	const {
		image,
		map,
		data,
		nextStep,
		setEditingFeature,
	} = props;

	const layer = {
		id: 'feature_data_edit_icons',
		type: 'symbol',
		source: 'feature_data_edit_icons',
		layout: {
			'icon-image': image || '/assets/edit_feature.svg',
			'icon-offset': [0, 40],
		},
	};

	const events = new Map([
		['click', e => {
			const editingIcon = e.features[0];
			const { for: featureId } = editingIcon.properties;
			const feature = data.get(featureId);
			setEditingFeature(feature);
			nextStep('/plant/tree/rows');
		}],
	]);

	return <Layer map={map} layer={layer} events={events} />;
};
