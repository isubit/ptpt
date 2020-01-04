import React from 'react';
import { Link } from 'react-router-dom';

import { MapConsumer } from 'contexts/MapState';

// include editingFeature into props
// if editingFeature, then show report for editingFeature
// if no editingFeature, default to first tree area
// if no features, empty table

// report heading text

// select tag for choosing report area  (need to pull these from the map sources)

// create tabs (these will update the table view)
// rebuild table on change of tab or change of planting area
// create the table (mobile and desktop)
// add in placeholder text for the rows

export const ReportWrapper = () => (
	<MapConsumer>
		{ mapCtx => {
			const ctx = { ...mapCtx.state, ...mapCtx.actions };
			return <Report {...ctx} />;
		}}
	</MapConsumer>
);

class Report extends React.Component {
	// need to get a list of all the features somehow
	state = {
		reportArea: this.props.editingFeature || null,
	}

	componentDidMount() {
		const { data } = this.props;
		console.log(data);
	}

	componentDidUpdate() {
		// whenever the reportArea changes update the table
	}

	render() {
		const { reportArea } = this.state;
		return (
			<div className="Report">
				<div className="reportActions">
					<div>
						<Link to="/">Back to Map</Link>
					</div>
					<div>
						{/* integrate to download */}
						<p>Download XLS File</p>
					</div>
					<div>
						{/* integrate to download */}
						<p>Download Shapefile</p>
					</div>
				</div>
				<div className="reportText">
					<p className="header-large">Cost Report</p>
					<p>Below is your econmic report for planting your tree area. You can use any of the options above to print, email or download your report.</p>
				</div>
				<div className="reportArea">
					<span className="inputLabel">View Report Area</span>
					{/* build this according to the features in map sources */}
					<select>
						<option>Tree Area 1</option>
					</select>
				</div>
				<div className="table-wrap">
					<h1>{ reportArea }</h1>
					{/* <ReportTable  reportArea={reportArea} /> */}
				</div>
			</div>
		);
	}
}
