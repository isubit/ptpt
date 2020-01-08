import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import uuid from 'uuid/v4';

import { annualSeries } from 'utils/formulas';
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
	// convert data into format that can be read into the table

	// build columns

	const tables = reportData.map(ea => {
		const {
			labels,
			costs,
		} = ea;
		const ids = [labels[0]];
		const unit_costs = [labels[1]];
		const units = [labels[2]];
		const qty = [labels[3]];
		const total_costs = [labels[4]];
		costs.forEach(cost => {
			cost.id && ids.push(cost.id);
			cost.unit_cost && unit_costs.push(cost.unit_cost);
			cost.units && units.push(cost.units);
			cost.qty && qty.push(cost.qty);
			if (cost.totalCost) {
				const total_cost = cost.totalCost;
				total_costs.push(total_cost);
			}
		});
		return [ids, unit_costs, units, qty, total_costs];
	});
	return (
		tables.map(table => (
			<div className="tableWrap">
				<div className="ReportTable" key={uuid()}>
					{
						table.map(column => (
							<div className="table-column" key={uuid()}>
								{
									column.map((element, index) => <div className={index % 2 === 0 ? 'table-cell' : 'table-cell light-blue'} key={uuid()}>{element}</div>)
								}
							</div>
						))
					}
				</div>
			</div>
		))
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
		const {
			properties: {
				acreage,
			},
		} = reportArea;

		const calcTotalCosts = (obj) => (
			obj.costs.map(cost => {
				const costTotal = cost.totalCost;
				return costTotal;
			}).reduce((a, b) => {
				const cost = Number(b.substring(1));
				return a + cost;
			}, 0).toFixed(2)
		);

		// Site Preparation Data
		const site_prep = {
			title: 'Site Preparation',
			labels: ['Site Preparation Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			costs: [
				{
					id: 'Tillage',
					unit_cost: '$15.40',
					units: '$/acre',
					qty: acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Herb Product',
					unit_cost: '$15.00',
					units: '$/acre',
					qty: acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Herb Application',
					unit_cost: '$53.00',
					units: '$/acre',
					qty: acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
			],
		};
		// calculate total costs
		const sitePrepCost = calcTotalCosts(site_prep);
		site_prep.costs.push({
			id: 'Site Preparation Total Cost',
			totalCost: `$${sitePrepCost}`,
		});

		// Establishment Data
		const establishment = {
			title: 'Establishment',
			labels: ['Establishment Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			costs: [
				{
					id: 'Seed',
					unit_cost: `$${reportArea.properties.configs.seed_price}`,
					units: '$/acre',
					qty: acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Seed Drilling',
					unit_cost: '$18.00',
					units: '$/acre',
					qty: acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Culitpacking',
					unit_cost: '$20.00',
					units: '$/acre',
					qty: acreage.toFixed(2),
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
			],
		};
		const totalEstablishmentCosts = calcTotalCosts(establishment);
		establishment.costs.push({
			id: 'Total Establishment Costs',
			totalCost: `$${totalEstablishmentCosts}`,
		});

		// Management Data
		const management = {
			title: 'Management',
			labels: ['Management Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
		};
		let management_row2;
		let management_row3;
		const management_row1 = {
			id: 'Mowing (year 1: 3x)',
			unit_cost: '$90.00',
			present_value: '$88.24',
			units: '$/acre',
			qty: acreage.toFixed(2),
			get totalCost() {
				const totalCost = Number(this.present_value.substring(1)) * this.qty;
				return `$${totalCost.toFixed(2)}`;
			},
		};
		if (reportArea.properties.configs.management.display === 'mow') {
			management_row2 = {
				id: 'Mowing (year 2-15)',
				unit_cost: '$30.00',
				present_value: '$327.23',
				units: '$/acre',
				qty: acreage.toFixed(2),
				get totalCost() {
					const totalCost = Number(this.present_value.substring(1)) * this.qty;
					return `$${totalCost.toFixed(2)}`;
				},
			};
			management_row3 = {
				id: 'Raking, Rowing, Baleing (year 2-15)',
				unit_cost: '$35.85',
				present_value: '$391.04',
				units: '$/acre',
				qty: acreage.toFixed(2),
				get totalCost() {
					const totalCost = Number(this.present_value.substring(1)) * this.qty;
					return `$${totalCost.toFixed(2)}`;
				},
			};
		} else if (reportArea.properties.configs.management.display === 'burn') {
			management_row2 = {
				id: 'Burning (year 2-6)',
				unit_cost: '$65.00',
				present_value: '$237.89',
				units: '$/acre',
				qty: acreage.toFixed(2),
				get totalCost() {
					const totalCost = Number(this.present_value.substring(1)) * this.qty;
					return `$${totalCost.toFixed(2)}`;
				},
			};
			management_row3 = {
				id: 'Burning (year 8, 10, 12, 14)',
				unit_cost: '$65.00',
				present_value: '$169.54',
				units: '$/acre',
				qty: acreage.toFixed(2),
				get totalCost() {
					const totalCost = Number(this.present_value.substring(1)) * this.qty;
					return `$${totalCost.toFixed(2)}`;
				},
			};
		}
		management.costs = [management_row1, management_row2, management_row3];
		const totalManagementCosts = calcTotalCosts(management);
		management.costs.push({
			id: 'Total Management Costs',
			totalCost: `$${totalManagementCosts}`,
		});

		// Opportunity Costs Data
		const {
			properties: {
				rent,
				csr,
			},
		} = reportArea;
		const average_csr = csr.reduce((a, b) => a + b, 0) / csr.length;
		const opportunity_cost = {
			title: 'Opportunity Cost',
			labels: ['Opportunity Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			costs: [
				{
					id: 'Land Rent (year 1-15)',
					unit_cost: `$${(average_csr * rent).toFixed(2)}`,
					units: '$/acre',
					qty: acreage.toFixed(2),
					get present_value() {
						const unitCost = Number(this.unit_cost.substring(1));
						const present_value = `$${annualSeries(unitCost, 0.02, 14).toFixed(2)}`;
						return present_value;
					},
					get totalCost() {
						const presentValue = Number(this.present_value.substring(1));
						return `$${(presentValue * this.qty).toFixed(2)}`;
					},
				},
				{
					id: 'General Operation Costs (year 1-15)',
					unit_cost: '$8.00',
					units: '$/acre',
					qty: acreage.toFixed(2),
					present_value: '$102.79',
					get totalCost() {
						const presentValue = Number(this.present_value.substring(1));
						return `$${(presentValue * this.qty).toFixed(2)}`;
					},
				},
			],
		};
		const totalOpportunityCost = calcTotalCosts(opportunity_cost);
		opportunity_cost.costs.push({
			id: 'Total Opportunity Costs',
			totalCost: `$${totalOpportunityCost}`,
		});
		const reportData = [site_prep, establishment, management, opportunity_cost];
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
