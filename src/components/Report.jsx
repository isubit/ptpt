import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import uuid from 'uuid/v4';

import { getFeatures } from 'utils/sources';
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

export const ReportWrapper = () => (
	<MapConsumer>
		{ mapCtx => {
			const features = getFeatures(mapCtx.state.data)
				.map(ea => {
					const labeledFeature = _.cloneDeep(ea);
					labeledFeature.properties.label = `${labeledFeature.properties.type.replace(/^\w/, c => c.toUpperCase())} ${labeledFeature.properties.type === 'tree' ? 'Rows' : 'Area'} ${labeledFeature.properties.index}`;
					return labeledFeature;
				});
			return <Report features={features} />;
		}}
	</MapConsumer>
);

const ReportTable = (props) => {
	// build all of the tables here
	const { reportData } = props;
	return (
		reportData.map(ea => {
			const numCols = ea.table_columns.length;
			return (
				<div className={`ReportTable table--${numCols}-cols`}>
					{
						ea.table_columns.map(col => <div className="table-cell" key={uuid()}>{col}</div>)
					}
					{
						ea.table_rows.map((row, index) => Object.values(row).map(val => <div className={index % 2 === 0 ? 'table-cell light-blue' : 'table-cell'} key={uuid()}>{val}</div>))
					}
				</div>
			);
		})
	);
};

class Report extends React.Component {
	// initialize state with either the editingFeature or the first entry in features property
	constructor(props) {
		super(props);
		let reportArea;
		if (props.editingFeature) {
			reportArea = props.features.find(feature => feature.id === props.editingFeature.id);
		} else {
			reportArea = props.features.length > 0 ? props.features[0] : null;
		}

		// calculate the reportData here
		const reportData = reportArea ? this.calcPrairieReportData(reportArea) : null;

		this.state = {
			reportArea,
			reportData,
		};

		console.log(this.state);
	}

	handleReportAreaChange = (e) => {
		// update reportArea then after setState, calculate report data then update the state
		const { features } = this.props;
		const featureLabel = e.target.value;

		const reportArea = features.find(feature => feature.properties.label === featureLabel);
		let reportData;
		if (reportArea) {
			if (reportArea.properties.type === 'tree') {
				reportData = this.calcTreeReportData(reportArea);
			} else if (reportArea.properties.type === 'prairie') {
				reportData = this.calcPrairieReportData(reportArea);
			}
		}
		(reportArea && reportData) && this.setState({
			reportArea,
			reportData,
		});
	}

	// calcTreeReportData = (reportArea) => {
	// }

	calcPrairieReportData = (reportArea) => {
		const site_prep = {
			title: 'Site Preparation',
			table_columns: ['Site Preparation Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			table_rows: [
				{
					id: 'Tillage',
					unit_cost: '$15.40',
					units: '$/acre',
					qty: reportArea.properties.acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Herb Product',
					unit_cost: '$15.00',
					units: '$/acre',
					qty: reportArea.properties.acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Herb Application',
					unit_cost: '$53.00',
					units: '$/acre',
					qty: reportArea.properties.acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
			],
		};

		const establishment = {
			title: 'Establishment',
			table_columns: ['Establishment Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			table_rows: [
				{
					id: 'Seed',
					unit_cost: `$${reportArea.properties.configs.seed_price}`,
					units: '$/acre',
					qty: reportArea.properties.acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Seed Drilling',
					unit_cost: '$18.00',
					units: '$/acre',
					qty: reportArea.properties.acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Culitpacking',
					unit_cost: '$20.00',
					units: '$/acre',
					qty: reportArea.properties.acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
			],
		};

		const management = {
			title: 'Management',
			table_columns: ['Management Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
		};
		if (reportArea.properties.configs.management.display === 'Mow') {
			management.table_rows = [
				{
					id: 'Mowing (year 1: 3x)',
					unit_cost: '$90.00',
					units: '$/acre',
					qty: reportArea.properties.acreage.toFixed(2),
					// get totalCost() {

					// }
				},
			];
		}

		const reportData = [site_prep, establishment];
		return reportData;
	}

	componentDidMount() {
	}

	componentDidUpdate() {
	}

	render() {
		const {
			props: {
				features,
			},
			state: {
				reportData,
				reportArea,
			},
		} = this;
		return (
			<div className="Report">
				<div className="reportActions distribute">
					<div className="distribute">
						<img src="../assets/left-arrow.svg" alt="Back to Map" />
						<Link to="/">Back to Map</Link>
					</div>
					<div className="distribute">
						<img src="../assets/download_xls.svg" alt="Download XLS file" />
						<p>Download XLS File</p>
					</div>
					<div className="distribute">
						<img src="../assets/download_shapefile.svg" alt="Download Shapefile" />
						<p>Download Shapefile</p>
					</div>
				</div>
				<div className="reportText">
					<p className="header-large">Cost Report</p>
					<p>Below is your econmic report for planting your tree area. You can use any of the options above to print, email or download your report.</p>
				</div>
				{
					features.length > 0 && (
						<>
							<div className="reportArea">
								<span className="inputLabel">View Report Area</span>
								<select onChange={(e) => this.handleReportAreaChange(e)}>
									{
										features.map(feature => (
											<option value={feature.properties.label} key={feature.id}>{feature.properties.label}</option>
										))
									}
								</select>
								<h1>{reportArea.properties.label}</h1>
							</div>
							<ReportTable reportData={reportData} />
						</>
					)
				}
			</div>
		);
	}
}
