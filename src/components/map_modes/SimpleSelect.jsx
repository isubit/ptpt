import React from 'react';

export class SimpleSelect extends React.Component {
	componentDidMount() {
		const {
			enableDrawMode,
		} = this.props;

		enableDrawMode('simple_select');
	}

	render() {
		return null;
	}
}
