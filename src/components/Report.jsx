import React from 'react';
import { Link } from 'react-router-dom';

// include editingFeature into props
// if editingFeature, then show report for editingFeature
// if no editingFeature, default to first tree area
// if no features, empty table

// logic for report will be included later, simply need to create the UI

// report heading text

// select tag for choosing report area  (need to pull these from the map sources)

// create tabs (these will update the table view)
// rebuild table on change of tab or change of planting area
// create the table (mobile and desktop)
// add in placeholder text for the rows

export class Report extends React.Component {
	state = {
		reportArea: this.props.editingFeature || null,
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
					<div className="reportTable">
						<ul className="reportNav">
							<li>Site Preparation</li>
							<li>Purchase</li>
							<li>Planting</li>
							<li>Replanting</li>
							<li>Annual</li>
							<li>Total</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}
