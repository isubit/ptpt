import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import uuid from 'uuid/v4';

import {
	annualSeries,
	calcTotalCosts,
	findAverage,
	findTreeEQIP,
	getEQIPCosts,
} from 'utils/reportHelpers';
import {
	getFeatures,
	getOptimalTreePlacements,
} from 'utils/sources';
import { MapConsumer } from 'contexts/MapState';
import treeStockSizes from 'references/tree_stock_sizes.json';
import treeTypes from 'references/tree_types.json';
import treeList from 'references/trees_list.json';
import treeCosts from 'references/tree_cost.json';

// include editingFeature into props
// if editingFeature, then show report for editingFeature
// if no editingFeature, default to first feature area
// if no features, empty table

// report heading text

// select tag for choosing report area  (need to pull these from the map sources)

// create tabs (these will update the table view)
// rebuild table on change of tab or change of planting area
// create the table (mobile and desktop)

export const ReportWrapper = (props) => {
	const {
		router: {
			location: {
				state = null,
			},
		},
	} = props;
	const editingFeature = state || null;
	return (
		<MapConsumer>
			{ mapCtx => {
				const features = getFeatures(mapCtx.state.data)
					.map(ea => {
						const labeledFeature = _.cloneDeep(ea);
						labeledFeature.properties.label = `${labeledFeature.properties.type.replace(/^\w/, c => c.toUpperCase())} ${labeledFeature.properties.type === 'tree' ? 'Rows' : 'Area'} ${labeledFeature.properties.index}`;
						return labeledFeature;
					});
				if (editingFeature) {
					return <Report editingFeature={editingFeature} features={features} />;
				}
				return <Report features={features} />;
			}}
		</MapConsumer>
	);
};

const ReportTable = (props) => {
	const {
		reportData,
		handleTabClick,
		activeTable,
	} = props;

	// build columns & nav
	const tabs = [];
	const tables = {};
	reportData.forEach(ea => {
		const {
			labels,
			costs,
			title,
		} = ea;
		const ids = [labels[0]];
		const unit_costs = [labels[1]];
		const units = [labels[2]];
		const qty = [labels[3]];
		const total_costs = [labels[4]];
		costs.forEach(cost => {
			cost.id ? ids.push(cost.id) : ids.push(null);
			cost.unit_cost ? unit_costs.push(cost.unit_cost) : unit_costs.push(null);
			cost.units ? units.push(cost.units) : units.push(null);
			cost.qty ? qty.push(cost.qty) : qty.push(null);
			if (cost.totalCost) {
				const total_cost = cost.totalCost;
				total_costs.push(total_cost);
			} else {
				total_costs.push(null);
			}
		});
		tabs.push(title);
		tables[title] = [ids, unit_costs, units, qty, total_costs];
	});
	return (
		<>
			<div className="scrollWrap spacer-top-1_5">
				<ul className="tableNav">
					{
						tabs.map(tab => (
							<li className={tab === activeTable ? 'tableTab active' : 'tableTab'} key={uuid()}><button type="button" onClick={(e) => handleTabClick(e)}>{tab}</button></li>
						))
					}
				</ul>
			</div>
			<div className="divider" />
			<div className="scrollWrap spacer-bottom-4">
				<div className="ReportTable" key={uuid()}>
					{
						tables[activeTable].map((column, colIndex) => {
							const lastCol = tables[activeTable].length === colIndex + 1;
							return (
								<div className="table-column" key={uuid()}>
									{
										column.map((element, elementIndex) => {
											const light_blue = elementIndex % 2 === 0 ? 'light-blue' : '';
											const lastElement = column.length === elementIndex + 1;
											const bolded = (elementIndex === 0 || (colIndex === 0 && lastElement) || (lastCol && lastElement)) ? 'bolded' : '';
											return (
												element
													? <div className={`table-cell ${light_blue} ${bolded}`} key={uuid()}>{element}</div>
													: <div className={`table-cell empty ${light_blue}`} key={uuid()} />
											);
										})
									}
								</div>
							);
						})
					}
				</div>
			</div>
		</>
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
		console.log(reportArea);
		let reportData;
		if (reportArea) {
			if (reportArea.properties.type === 'tree') {
				reportData = this.calcTreeReportData(reportArea);
			} else if (reportArea.properties.type === 'prairie') {
				reportData = this.calcPrairieReportData(reportArea);
			}
		} else {
			reportData = null;
		}

		this.state = {
			reportArea,
			reportData,
			activeTable: 'Site Preparation',
		};
	}

	handleReportAreaChange = (e) => {
		// update reportArea then after setState, calculate report data then update the state
		const { features } = this.props;
		const featureLabel = e.target.value;

		const reportArea = features.find(feature => feature.properties.label === featureLabel);
		console.log(reportArea);
		let reportData;
		if (reportArea) {
			if (reportArea.properties.type === 'tree') {
				reportData = this.calcTreeReportData(reportArea);
			} else if (reportArea.properties.type === 'prairie') {
				reportData = this.calcPrairieReportData(reportArea);
			}
		} else {
			reportData = null;
		}

		(reportArea && reportData) && this.setState(() => ({
			reportArea,
			reportData,
			activeTable: 'Site Preparation',
		}));
	}

	calcTreeReportData = (reportArea) => {
		const {
			properties: {
				acreage,
			},
		} = reportArea;
		const qty = acreage.toFixed(2);

		// Site Preparation costs
		const site_prep = {
			title: 'Site Preparation',
			labels: ['Site Preparation Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			costs: [
				{
					id: 'Chisel Plow',
					unit_cost: '$18.35',
					units: '$/acre',
					qty,
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Tandem Disk',
					unit_cost: '$15.40',
					units: '$/acre',
					qty,
					get totalCost() {
						const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
			],
		};
		const totalSitePrepCost = calcTotalCosts(site_prep);
		site_prep.costs.push({
			id: 'Total Site Preparation Costs',
			totalCost: `$${totalSitePrepCost}`,
		});

		// Input costs
		const inputs = {
			title: 'Inputs',
			labels: ['Input Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			costs: [
				{
					id: 'Princep (pre-emergent herbicide)',
					unit_cost: '$3.75',
					units: '$/pint',
					present_value: '$3.70',
					qty,
					get totalCost() {
						const totalCost = Number(this.present_value.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Ground Sprayer (pre-emergent)',
					unit_cost: '$7.25',
					units: '$/acre',
					present_value: '$6.97',
					qty,
					get totalCost() {
						const totalCost = Number(this.present_value.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Poast (post-emergent herbicide)',
					unit_cost: '$11.32',
					units: '$/pint',
					present_value: '$11.10',
					qty,
					get totalCost() {
						const totalCost = Number(this.present_value.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Boom Sprayer (post-emergent)',
					unit_cost: '$7.25',
					units: '$/acre',
					present_value: '$7.25',
					qty,
					get totalCost() {
						const totalCost = Number(this.present_value.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Granular Urea (50 lb N/ac)',
					unit_cost: '$0.56',
					units: '$/lb',
					present_value: '$27.62',
					qty,
					get totalCost() {
						const totalCost = Number(this.present_value.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Fertilizer spreader',
					unit_cost: '$7.30',
					units: '$/acre',
					present_value: '$7.02',
					qty,
					get totalCost() {
						const totalCost = Number(this.present_value.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Monitoring (Spring)',
					unit_cost: '$3.00',
					units: '$/acre',
					qty,
					get present_value() {
						const cost = Number(this.unit_cost.substring(1)) / (1.04 ** (4 / 12));
						const presentValue = annualSeries(cost, 0.04, 14);
						return presentValue;
					},
					get totalCost() {
						const totalCost = this.present_value * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Monitoring (Summer)',
					unit_cost: '$3.00',
					units: '$/acre',
					qty,
					get present_value() {
						const cost = Number(this.unit_cost.substring(1)) / (1.04 ** (7 / 12));
						const presentValue = annualSeries(cost, 0.04, 14);
						return presentValue;
					},
					get totalCost() {
						const totalCost = this.present_value * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
			],
		};
		const totalInputCosts = calcTotalCosts(inputs);
		inputs.costs.push({
			id: 'Total Input Costs',
			totalCost: `$${totalInputCosts}`,
		});

		// tree establishment data
		const {
			properties: {
				configs: {
					drip_irrigation,
					stock_size,
					rows,
				},
			},
		} = reportArea;
		const treeQty = getOptimalTreePlacements(reportArea).length;
		const tree_establishment = {
			title: 'Tree Establishment',
			labels: ['Tree Establishment Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
		};

		const tree_prices = [];
		rows.forEach(row => {
			let treePrice;
			const {
				type,
				species,
			} = row;
			const price_group = treeCosts[stock_size];
			// find tree species in tree list
			const treeDetails = treeList.find(tree => tree.id === species);
			// pull the display and check if it contains 'Willow' || 'Eastern Red Cedar'
			const treeName = treeDetails.display;
			if (treeName === 'Eastern Red Cedar' || treeName.includes('Willow')) {
				if (treeName === 'Eastern Red Cedar') {
					treePrice = price_group[treeName];
				} else if (treeName.includes('Willow')) {
					treePrice = price_group['Hybrid willow'];
				}
			} else {
				const treeTypeValue = treeTypes.find(ea => ea.id === type).value;
				if (treeTypeValue === 'Hardwood') {
					treePrice = price_group.Hardwoods;
				} else if (treeTypeValue === 'Evergreen') {
					treePrice = price_group.Conifers;
				} else if (treeTypeValue === 'Shrub') {
					treePrice = price_group.Shrubs;
				}
			}
			tree_prices.push(treePrice);
		});
		const avgTreePrice = findAverage(tree_prices);
		const tree_costs = {
			id: 'Trees (planting stock)',
			unit_cost: `$${avgTreePrice}`,
			units: '$/tree',
			qty: treeQty,
			get present_value() {
				const unitCost = Number(this.unit_cost.substring(1));
				return `$${unitCost / 1.04}`;
			},
			get totalCost() {
				const totalCost = Number(this.present_value.substring(1)) * this.qty;
				return `$${totalCost.toFixed(2)}`;
			},
		};
		let tree_planting_costs;
		const stockSizeValue = treeStockSizes.find(ea => ea.id === stock_size).value || null;
		if (stockSizeValue) {
			if (stockSizeValue === 'bareroot') {
				tree_planting_costs = {
					id: 'Tree planting (bareroot/cutting)',
					unit_cost: '$220.00',
					units: '$/acre',
					present_value: '$211.54',
					qty,
					get totalCost() {
						const totalCost = Number(this.present_value.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				};
			} else if (stockSizeValue.includes('container')) {
				tree_planting_costs = {
					id: 'Tree planting (containerized)',
					unit_cost: '$1.50',
					units: '$/tree',
					present_value: '$1.44',
					qty: treeQty,
					get totalCost() {
						const totalCost = Number(this.present_value.substring(1)) * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				};
			}
		}
		const plastic_mulch_costs = {
			id: 'Plastic Mulch',
			unit_cost: '$450.00',
			units: '$/acre',
			qty,
			get totalCost() {
				const totalCost = Number(this.unit_cost.substring(1)) * this.qty;
				return `$${totalCost.toFixed(2)}`;
			},
		};
		const costs = [tree_costs, tree_planting_costs, plastic_mulch_costs];
		tree_establishment.costs = costs;
		if (drip_irrigation) {
			tree_establishment.costs.push({
				id: 'Watering (drip irrigation)',
				unit_cost: '$4.50',
				units: '$/tree',
				present_value: '$4.33',
				qty: treeQty,
				get totalCost() {
					const totalCost = Number(this.present_value.substring(1)) * this.qty;
					return `$${totalCost.toFixed(2)}`;
				},
			});
		}
		const totalEstablishmentCosts = calcTotalCosts(tree_establishment);
		tree_establishment.costs.push({
			id: 'Total Tree Establishment Costs',
			totalCost: `$${totalEstablishmentCosts}`,
		});

		// Tree Replacement costs
		const tree_replacement_costs = {
			title: 'Tree Replacement',
			labels: ['Tree Replacement Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			costs: [
				{
					id: 'Tree replacement (natural mortality)',
					unit_cost: tree_costs.unit_cost,
					units: '$/tree',
					qty: Math.round(treeQty * 0.1),
					get present_value() {
						return Number(this.unit_cost.substring(1)) / (1.02 ** 3);
					},
					get totalCost() {
						const totalCost = this.present_value * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
				{
					id: 'Tree planting (by hand)',
					unit_cost: '$1.50',
					units: '$/tree',
					qty: Math.round(treeQty * 0.1),
					get present_value() {
						return Number(this.unit_cost.substring(1)) / (1.02 ** 3);
					},
					get totalCost() {
						const totalCost = this.present_value * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
			],
		};
		const totalTreeReplacementCosts = calcTotalCosts(tree_replacement_costs);
		tree_replacement_costs.costs.push({
			id: 'Total Tree Replacement Costs',
			totalCost: `$${totalTreeReplacementCosts}`,
		});

		// Opportunity costs
		const {
			properties: {
				csr,
				rent,
				configs: {
					pasture_conversion,
				},
			},
		} = reportArea;
		const opportunity_cost = {
			title: 'Opportunity Costs',
			labels: ['Opportunity Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			costs: [
				{
					id: 'Land rent row crop (non-irrigated)',
					unit_cost: `$${findAverage(csr) * rent}`,
					units: '$/acre',
					qty,
					get present_value() {
						return annualSeries(Number(this.unit_cost.substring(1)), 0.04, 14);
					},
					get totalCost() {
						const totalCost = this.present_value * this.qty;
						return `$${totalCost.toFixed(2)}`;
					},
				},
			],
		};
		if (pasture_conversion) {
			opportunity_cost.costs.push({
				id: 'Land rent pasture',
				unit_cost: '$51.00',
				units: '$/acre',
				qty,
				get present_value() {
					return annualSeries(Number(this.unit_cost.substring(1)), 0.04, 14);
				},
				get totalCost() {
					const totalCost = this.present_value * this.qty;
					return `$${totalCost.toFixed(2)}`;
				},
			});
		}
		const totalOpportunityCost = calcTotalCosts(opportunity_cost);
		opportunity_cost.costs.push({
			id: 'Total Opportunity Costs',
			totalCost: `$${totalOpportunityCost}`,
		});

		// EQIP
		const {
			properties: {
				rowLength,
			},
		} = reportArea;
		const eqip = findTreeEQIP(reportArea.properties);
		console.log(eqip);
		const eqip_costs = {
			labels: ['Conservation Costs', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			title: 'EQIP',
		};
		eqip_costs.costs = getEQIPCosts(eqip, qty, treeQty, rowLength);
		const totalEQIPCosts = calcTotalCosts(eqip_costs) || 0;
		eqip_costs.costs.push({
			id: 'Total EQIP Costs',
			totalCost: `$${totalEQIPCosts}`,
		});

		const reportData = [site_prep, inputs, tree_establishment, tree_replacement_costs, opportunity_cost, eqip_costs];
		return reportData;
	}

	calcPrairieReportData = (reportArea) => {
		const {
			properties: {
				acreage,
			},
		} = reportArea;

		// Site Preparation Costs
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
		const totalSitePrepCost = calcTotalCosts(site_prep);
		site_prep.costs.push({
			id: 'Site Preparation Total Cost',
			totalCost: `$${totalSitePrepCost}`,
		});

		// Establishment Costs
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

		// Management Costs
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

		// Opportunity Costs
		const {
			properties: {
				rent,
				csr,
			},
		} = reportArea;
		const average_csr = findAverage(csr);
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

		// Conservation costs
		const totalSitePrepUnitCosts = site_prep.costs.map(cost => {
			const unitCost = cost.unit_cost ? cost.unit_cost : null;
			if (unitCost) {
				return Number(unitCost.substring(1));
			}
			return 0;
		}).reduce((a, b) => a + b, 0);
		const totalEstablishmentUnitCosts = establishment.costs.map(cost => {
			const unitCost = cost.unit_cost ? cost.unit_cost : null;
			if (unitCost) {
				return Number(unitCost.substring(1));
			}
			return 0;
		}).reduce((a, b) => a + b, 0);
		const conservation_program = {
			title: 'Conservation Programs',
			labels: ['Conservation Program', 'Unit Costs', 'Units', 'Qty', 'Total Costs'],
			costs: [
				{
					id: 'Cost Share 90% (year 1)',
					unit_cost: `$${((totalSitePrepUnitCosts + totalEstablishmentUnitCosts) * 0.9).toFixed(2)}`,
					units: '$/acre',
					qty: acreage.toFixed(2),
					get totalCost() {
						const unitCost = Number(this.unit_cost.substring(1));
						return `$${(unitCost * this.qty).toFixed(2)}`;
					},
				},
				{
					id: 'Rent Payment (year 1-15)',
					unit_cost: `$${(Number(opportunity_cost.costs[0].present_value.substring(1)) * 0.9).toFixed(2)}`,
					units: '$/acre',
					qty: acreage.toFixed(2),
					get totalCost() {
						const unitCost = Number(this.unit_cost.substring(1));
						return `$${(unitCost * this.qty).toFixed(2)}`;
					},
				},
			],
		};
		const totalConservationCosts = calcTotalCosts(conservation_program);
		conservation_program.costs.push({
			id: 'Total Conservation',
			totalCost: `$${totalConservationCosts}`,
		});

		const reportData = [site_prep, establishment, management, opportunity_cost, conservation_program];
		return reportData;
	}

	handleTabClick = (event) => {
		const updateactiveTable = event.target.textContent;
		this.setState(() => ({ activeTable: updateactiveTable }));
	}

	render() {
		const {
			handleTabClick,
			props: {
				features,
			},
			state: {
				reportData,
				reportArea,
				activeTable,
			},
		} = this;
		return (
			<div className="Report">
				<div className="reportActions">
					<div className="distribute">
						<img src="../assets/left-arrow.svg" alt="Back to Map" />
						<Link to="/" className="map-link">Back to Map</Link>
					</div>
					<div className="distribute reportAction">
						<img src="../assets/download_xls.svg" alt="Download XLS file" />
						<p>Download XLS File</p>
					</div>
					<div className="distribute reportAction">
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
							<div className="reportArea flex-column">
								<div className="selectWrap flex-column">
									<span className="inputLabel">View Report Area</span>
									<select onChange={(e) => this.handleReportAreaChange(e)}>
										{
											features.map(feature => (
												<option value={feature.properties.label} key={feature.id}>{feature.properties.label}</option>
											))
										}
									</select>
								</div>
								<h1>{reportArea.properties.label}</h1>
							</div>
							<ReportTable reportData={reportData} handleTabClick={handleTabClick} activeTable={activeTable} />
						</>
					)
				}
			</div>
		);
	}
}
