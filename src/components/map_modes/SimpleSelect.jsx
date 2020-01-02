import React from 'react';
import Debug from 'debug';

const debug = Debug('MapComponent');

export class SimpleSelect extends React.Component {
	componentDidMount() {
		const {
			draw,
			setEditingFeature,
		} = this.props;

		// We use this mode because we don't want to remove the whole draw controller from the map.
		debug('Entering simple_select mode.');
		setEditingFeature(null, () => draw.changeMode('simple_select'));
	}

	render() {
		return null;
	}
}
