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
		},
	};

	let events = [
		['click', e => {
			const editingIcon = e.features[0];
			const { for: featureId } = editingIcon.properties;
			const feature = data.get(featureId);
			setEditingFeature(feature);
			nextStep('/plant/tree/rows');
		}],
	];
	events = new Map(events);

	return <Layer map={map} layer={layer} events={events} />;
};
