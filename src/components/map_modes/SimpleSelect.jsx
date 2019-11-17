import React from 'react';

export class SimpleSelect extends React.Component {
	componentDidMount() {
		const {
			draw,
		} = this.props;

		draw.changeMode('simple_select');
	}

	render() {
		return null;
	}
}
