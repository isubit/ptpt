import React from 'react';
import Debug from 'debug';

const debug = Debug('MapComponent');

export class SimpleSelect extends React.Component {
	componentDidMount() {
		const {
			draw,
			setEditingFeature,
			toggleHelper,
		} = this.props;

		// We use this mode because we don't want to remove the whole draw controller from the map.
		debug('Entering simple_select mode.');
		setEditingFeature(null, () => draw.changeMode('simple_select'));
		toggleHelper({
			text: 'To get started, plant trees or prairie by using the above tools. You can also view different map layers.',
			buttonText: 'Okay! I got it!',
		});
	}

	render() {
		return null;
	}
}
