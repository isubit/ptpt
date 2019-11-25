import React from 'react';

export class SimpleSelect extends React.Component {
	componentDidMount() {
		const {
			draw,
		} = this.props;

		// This actually doesn't matter much because in simple_select mode, the draw data has been cleared, so there is nothing to select.
		// We use this mode only because we don't want to remove the whole draw controller from the map.
		draw.changeMode('simple_select');
	}

	render() {
		return null;
	}
}
