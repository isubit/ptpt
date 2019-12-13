import React from 'react';
import {
	// Link,
	Redirect,
} from 'react-router-dom';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

// import tree from 'test_data/tree.json';
// import prairie from 'test_data/prairie.json';
import Debug from 'debug';
import { TreePlantingModal } from '../modals/TreePlantingModal';

const debug = Debug('MapComponent');

/* const testData = {
	tree,
	prairie,
}; */

export const DrawLineMode = MapboxDraw.modes.draw_line_string;

DrawLineMode.clickAnywhere = function clickAnywhere(state, e) {
	// This ends the drawing after the user creates a second point, triggering this.onStop
	if (state.currentVertexPosition === 1) {
		return this.changeMode('simple_select', { featureIds: [state.line.id] }); // eslint-disable-line react/no-this-in-sfc
	}

	this.updateUIClasses({ mouse: 'add' }); // eslint-disable-line react/no-this-in-sfc
	state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
	if (state.direction === 'forward') {
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
		// this.changeMode('simple_select', {}, { silent: true }); // Unsure if this is necessary.
	}
};

export class Planting extends React.Component {
	events = new Map()

	componentDidMount() {
		this.setDrawMode();
	}

	componentDidUpdate() {
		const {
			events,
			props: {
				map,
			},
		} = this;

		// Clean up events.
		events.forEach((value, key) => {
			map.off(key, value);
			events.delete(key);
		});

		this.setDrawMode();
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

		if (!step) {
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
				// feature.properties = {
				// 	...feature.properties,
				// 	type,
				// 	configs: testData[type].properties.configs, // These are some default properties for testing.
				// };
				// draw.add(feature);
				debug('Created feature:', feature);
				nextStep(`/plant/${type}/${steps[0]}`);
				setEditingFeature(feature);
			};
			map.on('draw.create', onCreate);
			this.events.set('draw.create', onCreate);
		} else if (editingFeature) {
			// Else, if we're on a config step and there is a feature being edited, enter direct_select mode.
			// This actually doesn't matter too much because if we're on a config step the modal overlay blocks map interactivity.
			debug('Entering direct_select mode.', editingFeature);
			if (!draw.get(editingFeature.id)) {
				draw.add(editingFeature);
			}
			draw.changeMode('direct_select', { featureId: editingFeature.id });
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
			// deleteFeature,
			editingFeature,
			saveFeature,
			nextStep,
			type,
		} = this.props;

		if (!editingFeature) {
			// If there isn't a feature being edited, navigate to the draw step.
			return <Redirect to={`/plant/${type}`} />;
		}

		/* const {
			properties: {
				configs,
			},
		} = editingFeature; */

		// If we're on a config step, render the form.
		return step ? (
			<div className="Planting MapModeForm vertical-align">
				{/* the modal below needs to be replaced with a prebuilt component */}
				{/* <div className="modal margin-center">
					<div>
						<p>Some pre-filled properties for this {editingFeature.properties.type} polygon...</p>
						{editingFeature.properties.type === 'tree' && (
							<>
								<p>Rows: {configs.rows.length}</p>
								{
									configs.rows.map((ea, i) => (
										<div key={`row-${i + 1}`} className="spacer-left-1">
											<p>Row {i + 1}</p>
											<div className="spacer-left-1">
												<p>Type: {ea.type.display}</p>
												<p>Species: {ea.species.display}</p>
											</div>
										</div>
									))
								}
								<p>Row Spacing: {configs.spacing_rows.value} {configs.spacing_rows.unit}</p>
								<p>Tree Spacing: {configs.spacing_trees.value} {configs.spacing_trees.unit}</p>
								<p>Drip Irrigation: {configs.drip_irrigation ? 'yes' : 'no'}</p>
							</>
						)}

						{editingFeature.properties.type === 'prairie' && (
							<>
								<p>Seed: {configs.seed.value}</p>
								<p>Management: {configs.management.display}</p>
								<p>Cropping System: {configs.cropping_system.display}</p>
								<p>Pest Control: {configs.pest_control.value}</p>
							</>
						)}

						<div className="spacer-top-2 distribute">
							{
								data.get(editingFeature.id)
									? (
										<div>
											<span onClick={() => deleteFeature(editingFeature.id)} onKeyDown={e => e.keyCode === 13 && deleteFeature(editingFeature.id)} role="button" tabIndex="0">Delete</span>
										</div>
									)
									: (
										<div>
											<Link className="modal-link" to={`/plant/${type}`}>Start Over</Link>
										</div>
									)
							}
							<button onClick={saveFeature} className="Button" type="button">Done</button>
						</div>
					</div>
				</div> */}
				<TreePlantingModal editingFeature={editingFeature} saveFeature={saveFeature} nextStep={nextStep} />
			</div>
		) : null;
	}
}
