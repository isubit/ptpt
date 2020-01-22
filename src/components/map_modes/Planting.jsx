import React from 'react';
import {
	Redirect,
} from 'react-router-dom';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import Debug from 'debug';
import { PlantingModal } from '../modals/PlantingModal';

const debug = Debug('MapComponent');

export const DrawLineMode = MapboxDraw.modes.draw_line_string;

DrawLineMode.clickAnywhere = function clickAnywhere(state, e) {
	debug('Clicked', state, e);
	// This ends the drawing after the user creates a second point, triggering this.onStop
	if (state.currentVertexPosition === 1) {
		state.line.updateCoordinate(1, e.lngLat.lng, e.lngLat.lat);
		return this.changeMode('simple_select', { featureIds: [state.line.id] }); // eslint-disable-line react/no-this-in-sfc
	}

	this.updateUIClasses({ mouse: 'add' }); // eslint-disable-line react/no-this-in-sfc
	state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
	debug('Update', state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
	if (state.direction === 'forward') {
		debug('Forward', state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
		state.currentVertexPosition += 1; // eslint-disable-line no-param-reassign
		state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
	} else {
		state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
	}

	return null;
};

DrawLineMode.onStop = function onStop(state) {
	// Check to see if we've deleted this feature.
	if (this.getFeature(state.line.id) === undefined) return;

	if (state.line.isValid()) {
		const lineGeoJson = state.line.toGeoJSON();

		this.map.fire('draw.create', {
			features: [lineGeoJson],
		});
	} else {
		this.deleteFeature([state.line.id], { silent: true });
	}
};

export class Planting extends React.Component {
	events = new Map()

	componentDidMount() {
		this.setDrawMode();
		this.determineHelper();
	}

	componentDidUpdate(prevProps) {
		const {
			events,
			props: {
				map,
				type,
			},
		} = this;

		// Clean up events.
		events.forEach((value, key) => {
			map.off(key, value);
			events.delete(key);
		});

		this.setDrawMode();

		if (prevProps.type !== type) {
			this.determineHelper();
		}
	}

	determineHelper() {
		const {
			toggleHelper,
			type,
		} = this.props;

		if (type === 'tree') {
			toggleHelper({
				text: 'Draw a tree row by clicking where you want the row to start and end. You can add more rows and define your trees during configuration.',
				buttonText: 'No problem!',
			});
		} else {
			toggleHelper({
				text: 'Draw a prairie area by clicking to draw the corners of a shape. Click the starting point to finish drawing.',
				buttonText: 'No problem!',
			});
		}
	}

	setDrawMode() {
		const {
			router: {
				match: {
					params: {
						step,
					},
				},
			},
			setEditingFeature,
			nextStep,
			map,
			draw,
			editingFeature,
			type,
			steps,
		} = this.props;

		if (editingFeature) {
			// Else, if we're on a config step and there is a feature being edited, enter direct_select mode.
			// This actually doesn't matter too much because if we're on a config step the modal overlay blocks map interactivity.
			debug('Entering direct_select mode.', editingFeature);
			if (!draw.get(editingFeature.id)) {
				draw.add(editingFeature);
			}
			draw.changeMode('direct_select', { featureId: editingFeature.id });
		} else if (!step) {
			// If not on a config step, that means we're drawing, so enter draw_polygon mode with a clean slate.
			debug('Entering draw_polygon mode.');

			draw.deleteAll();
			editingFeature && setEditingFeature(null);

			if (type === 'tree') {
				draw.changeMode('draw_line');
			} else {
				draw.changeMode('draw_polygon');
			}

			// Setup a new draw.create listener.
			// This will update the feature with some default properties,
			// then move the router onto the next step and set the feature being edited.
			const onCreate = e => {
				map.off('draw.create', onCreate);
				const feature = e.features[0];
				// feature properties need to be populated with the planting modal
				feature.properties = {
					type,
				};
				debug('Created feature:', feature);
				setEditingFeature(feature, () => nextStep(`/plant/${type}/${steps[0]}`));
			};
			map.on('draw.create', onCreate);
			this.events.set('draw.create', onCreate);
		}
	}

	componentWillUnmount() {
		const {
			events,
			props: {
				setEditingFeature,
				map,
				draw,
			},
		} = this;

		// Clean up events.
		events.forEach((value, key) => {
			map && map.off(key, value);
			events.delete(key);
		});

		// Clean up draw and feature state.
		draw && draw.deleteAll();
		setEditingFeature(null);
	}

	render() {
		const {
			router: {
				match: {
					params: {
						step,
					},
				},
			},
			// data,
			deleteFeature,
			setEditingFeature,
			editingFeature,
			saveFeature,
			nextStep,
			type,
			steps,
		} = this.props;

		if (!editingFeature) {
			// If there isn't a feature being edited, navigate to the draw step.
			return <Redirect to={`/plant/${type}`} />;
		}

		const stepIndex = steps.indexOf(step);

		if (stepIndex === -1) {
			return <Redirect to={`/plant/${type}/${steps[0]}`} />;
		}

		return (
			<div className="Planting MapModeForm vertical-align">
				<PlantingModal editingFeature={editingFeature} setEditingFeature={setEditingFeature} deleteFeature={deleteFeature} saveFeature={saveFeature} nextStep={nextStep} step={step} steps={steps} stepIndex={stepIndex} />
			</div>
		);
	}
}
