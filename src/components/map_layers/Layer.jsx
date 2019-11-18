import React from 'react';

export class Layer extends React.Component {
	events = new Map()

	componentDidMount() {
		this.setupLayer();
		this.setupEvents();
	}

	componentDidUpdate() {
		this.setupLayer();
		this.setupEvents();
	}

	componentWillUmount() {
		const {
			events: currentEvents,
			props: {
				layer,
				map,
			},
		} = this;

		// Remove layer and clean up events.
		map.removeLayer(layer.id);
		currentEvents.forEach((value, key) => {
			map.off(key, layer.id, value);
			currentEvents.delete(key);
		});
	}

	setupLayer() {
		// This sets up the layer.
		const {
			layer,
			map,
		} = this.props;
		if (map.getLayer(layer.id)) {
			map.removeLayer(layer.id);
		}
		map.addLayer(layer);
	}

	setupEvents() {
		// This handles setting up and cleaning events on this layer.
		const {
			events: currentEvents,
			props: {
				events = new Map(),
				layer,
				map,
			},
		} = this;

		// Clean up events.
		currentEvents.forEach((value, key) => {
			map.off(key, layer.id, value);
			currentEvents.delete(key);
		});

		// Setup events.
		events.forEach((value, key) => {
			map.on(key, layer.id, value);
			currentEvents.set(key, value);
		});
	}

	render() {
		return null;
	}
}
