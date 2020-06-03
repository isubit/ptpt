import React from 'react';
import Debug from 'debug';

const debug = Debug('MapComponent');

export class Layer extends React.Component {
	events = new Map()

	componentDidMount() {
		const {
			layer,
		} = this.props;

		this.setupLayer();
		this.setupEvents();
		debug('Added layer:', layer.id);
	}

	componentDidUpdate() {
		this.setupLayer();
		this.setupEvents();
	}

	componentWillUnmount() {
		const {
			events: currentEvents,
			props: {
				layer,
				map,
			},
		} = this;

		// Remove layer and clean up events.
		map && map.removeLayer(layer.id);
		currentEvents.forEach((value, key) => {
			map && map.off(key, layer.id, value);
			currentEvents.delete(key);
		});
		debug('Removed layer:', layer.id);
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

		const layerToInsertBefore = (() => {
			if (map) {
				const { layers } = map.getStyle();
				let lastBaseMapLayer;
				if (map.satelliteEnabled) {
					lastBaseMapLayer = 'satellite';
				} else {
					lastBaseMapLayer = 'country-label';
				}
				const indexOfLastBaseMapLayer = layers.findIndex(ea => ea.id === lastBaseMapLayer);
				return indexOfLastBaseMapLayer === layers.length - 1 ? null : layers[indexOfLastBaseMapLayer + 1].id;
			}

			return null;
		})();

		map.addLayer(layer, layerToInsertBefore || undefined);
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
