import React from 'react';
import calcBbox from '@turf/bbox';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import download from 'js-file-download';
import JSZip from 'jszip';
import shpwrite from 'shp-write';
import uuid from 'uuid/v4';
import Debug from 'debug';

import {
	annualSeries,
	annualizedCost,
	calcTotalCosts,
	findAverage,
	findTreeAverageCost,
	findTreeEQIP,
	getEQIPCosts,
} from 'utils/reportHelpers';
import {
	getFeatures,
	getOptimalTreePlacements,
} from 'utils/sources';
import { spreadsheet } from 'utils/spreadsheet';
import { MapConsumer } from 'contexts/MapState';
import seedMixes from 'references/prairie_classification_prices.json';
import treeStockSizes from 'references/tree_stock_sizes.json';
import treeTypes from 'references/tree_types.json';
import treeList from 'references/trees_list.json';
// import { ReportModal } from './modals/ReportModal';
import { SettingsConsumer } from '../contexts/Settings';

const debug = Debug('Report');

// include editingFeature into props
// if editingFeature, then show report for editingFeature
// if no editingFeature, default to first feature area
// if no features, empty table

// report heading text

// select tag for choosing report area  (need to pull these from the map sources)

// create tabs (these will update the table view)
// rebuild table on change of tab or change of planting area
// create the table (mobile and desktop)

let lastSelectedArea;

export const ReportWrapper = (props) => {
	const {
		router: {
			location: {
				state = null,
			},
			history,
		},
	} = props;
	const editingFeature = state || null;

	return (
		<SettingsConsumer>
			{ (settingsCtx) => (
				<MapConsumer>
					{ mapCtx => {
						const boundMapToFeature = feature => {
							const bbox = calcBbox(feature);
							mapCtx.actions.updateCurrentMapDetails({
								bounds: bbox,
							});
						};
						const features = getFeatures(mapCtx.state.data)
							.map(ea => {
								const labeledFeature = _.cloneDeep(ea);
								labeledFeature.properties.label = `${labeledFeature.properties.type.replace(/^\w/, c => c.toUpperCase())} Area ${labeledFeature.properties.index}`;
								return labeledFeature;
							});
						if (features.length > 0) {
							if (editingFeature) {
								return <Report editingFeature={editingFeature} features={features} boundMapToFeature={boundMapToFeature} />;
							}
							return <Report features={features} boundMapToFeature={boundMapToFeature} />;
						}
						if (settingsCtx.state.helpersDismissed) {
							settingsCtx.actions.activateHelpers();
						}
						settingsCtx.actions.toggleHelper({
							text: 'Draw a tree row or prairie to see its report.',
							buttonText: 'Okay!',
							helperFor: 'report',
							onClose: () => {
								history.push('/');
								if (settingsCtx.state.helpersDismissed) {
									settingsCtx.actions.dismissHelpers();
								}
							},
						});
						return null;
					}}
				</MapConsumer>
			)}
		</SettingsConsumer>

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
		costs.filter(cost => !!cost).forEach(cost => {
			cost.id ? ids.push(cost.id) : ids.push(null);
			(Number(cost.unit_cost) || Number(cost.unit_cost) === 0) ? unit_costs.push(`${cost.unitCost < 0 ? '- ' : ''}$${Math.abs(Number(cost.unit_cost)).toFixed(2)}`) : unit_costs.push(null);
			cost.units ? units.push(cost.units) : units.push(null);
			if (cost.units && (cost.units === '$/tree' || cost.units === 'N/A')) {
				(cost.qty || cost.qty === 0) ? qty.push(cost.qty.toFixed(0)) : qty.push(null);
			} else {
				(cost.qty || cost.qty === 0) ? qty.push(cost.qty.toFixed(2)) : qty.push(null);
			}
			if (cost.totalCost || cost.totalCost === 0) {
				const total_cost = cost.totalCost;
				total_costs.push(`${total_cost < 0 ? '- ' : ''}$${Math.abs(Number(total_cost)).toFixed(2)}`);
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
			<div className="scrollWrap">
				<div className="ReportTable" key={uuid()}>
					{
						tables[activeTable].map((column, colIndex) => {
							const lastCol = tables[activeTable].length === colIndex + 1;
							if (column.filter(element => !!element).length === 0) return null;
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
		debug(props);
		let reportArea;
		if (props.editingFeature) {
			reportArea = props.features.find(feature => feature.id === props.editingFeature.id);
		} else {
			reportArea = props.features.find(feature => feature.properties.label === lastSelectedArea);
			if (!reportArea) {
				reportArea = props.features.length > 0 ? props.features[0] : null;
			}
		}
		let reportData;
		if (reportArea) {
			this.props.boundMapToFeature(reportArea);
			debug(`Reporting for: ${reportArea.properties.label}`);
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
		const {
			boundMapToFeature,
			features,
		} = this.props;
		const featureLabel = e.target.value;

		const reportArea = features.find(feature => feature.properties.label === featureLabel);
		let reportData;
		if (reportArea) {
			boundMapToFeature(reportArea);
			lastSelectedArea = featureLabel;
			debug(`Reporting for: ${reportArea.properties.label}`);
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
		debug('Preparing report data for feature:', reportArea);
		const {
			properties: {
				acreage,
			},
		} = reportArea;
		const qty = acreage;

		// Site Preparation Costs
		const site_prep = {
			title: 'Site Preparation',
			labels: ['Site Preparation Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			costs: [
				{
					id: 'Chisel Plow',
					unit_cost: 18.35,
					units: '$/acre',
					qty,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Tandem Disk',
					unit_cost: 15.40,
					units: '$/acre',
					qty,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
			],
		};
		const totalSitePrepCost = calcTotalCosts(site_prep);
		site_prep.costs.push({
			id: 'Total Site Preparation Costs',
			totalCost: totalSitePrepCost,
		});

		// Input Costs
		const inputs = {
			title: 'Inputs',
			labels: ['Input Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			costs: [
				{
					id: 'Princep (pre-emergent herbicide)',
					unit_cost: 3.75,
					units: '$/pint/acre',
					get present_value() {
						return this.unit_cost / (1.02 ** (4 / 12));
					},
					qty,
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Ground sprayer (pre-emergent)',
					unit_cost: 7.25,
					units: '$/acre',
					get present_value() {
						return this.unit_cost / 1.02;
					},
					qty,
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Poast (post-emergent herbicide)',
					unit_cost: 11.32,
					units: '$/pint',
					get present_value() {
						return this.unit_cost / (1.02 ** (6 / 12));
					},
					qty,
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Boom sprayer (post-emergent)',
					unit_cost: 7.25,
					units: '$/acre',
					get present_value() {
						return this.unit_cost;
					},
					qty,
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Granular Urea (50 lb N/ac)',
					unit_cost: 28, // This is $0.56/lb * 50 lb.
					units: '$/acre',
					get present_value() {
						return this.unit_cost / (1.02 ** (5 / 12));
					},
					qty,
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Fertilizer spreader',
					unit_cost: 7.30,
					units: '$/acre',
					get present_value() {
						return this.unit_cost / 1.02;
					},
					qty,
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Monitoring (Spring)',
					unit_cost: 3.00,
					units: '$/acre',
					qty,
					get present_value() {
						// const cost = this.unit_cost / (1.02 ** (4 / 12));
						// const presentValue = annualSeries(cost, 0.02, 15);
						const presentValue = annualSeries(this.unit_cost, 0.02, 15);
						return presentValue;
					},
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Monitoring (Summer)',
					unit_cost: 3.00,
					units: '$/acre',
					qty,
					get present_value() {
						// const cost = this.unit_cost / (1.02 ** (7 / 12));
						// const presentValue = annualSeries(cost, 0.02, 15);
						const presentValue = annualSeries(this.unit_cost, 0.02, 15);
						return presentValue;
					},
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
			],
		};
		const totalInputCosts = calcTotalCosts(inputs);
		inputs.costs.push({
			id: 'Total Input Costs',
			totalCost: totalInputCosts,
		});

		// Tree Establishment Costs
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
			labels: ['Tree Establishment Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
		};

		const avgTreePrice = findTreeAverageCost(rows, stock_size);
		const tree_costs = {
			id: 'Trees (planting stock)',
			unit_cost: avgTreePrice,
			units: '$/tree',
			qty: treeQty,
			get present_value() {
				return this.unit_cost / 1.02;
			},
			get totalCost() {
				const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
				const totalCost = annualizedPVCost * this.qty;
				return totalCost;
			},
		};
		let tree_planting_costs;
		const stockSizeValue = treeStockSizes.find(ea => ea.id === stock_size).value || null;
		if (stockSizeValue) {
			if (stockSizeValue === 'bareroot') {
				tree_planting_costs = {
					id: 'Tree planting (bareroot)',
					unit_cost: 220.00,
					units: '$/acre',
					get present_value() {
						return this.unit_cost / 1.02;
					},
					qty,
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				};
			} else if (stockSizeValue.includes('container')) {
				tree_planting_costs = {
					id: 'Tree planting (containerized)',
					unit_cost: 1.50,
					units: '$/tree',
					get present_value() {
						return this.unit_cost / 1.02;
					},
					qty: treeQty,
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				};
			}
		}
		const plastic_mulch_costs = {
			id: 'Plastic Mulch',
			unit_cost: 450.00,
			units: '$/acre',
			qty,
			get totalCost() {
				const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
				const totalCost = annualizedUnitCost * this.qty;
				return totalCost;
			},
		};
		const costs = [tree_costs, tree_planting_costs, plastic_mulch_costs];
		tree_establishment.costs = costs;
		if (drip_irrigation) {
			tree_establishment.costs.push({
				id: 'Watering (drip irrigation)',
				unit_cost: 4.50,
				units: '$/tree',
				get present_value() {
					return this.unit_cost / 1.02;
				},
				qty: treeQty,
				get totalCost() {
					const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
					const totalCost = annualizedPVCost * this.qty;
					return totalCost;
				},
			});
		}
		const totalEstablishmentCosts = calcTotalCosts(tree_establishment);
		tree_establishment.costs.push({
			id: 'Total Tree Establishment Costs',
			totalCost: totalEstablishmentCosts,
		});

		// Tree Replacement costs
		const tree_replacement_costs = {
			title: 'Tree Replacement',
			labels: ['Tree Replacement Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			costs: [
				{
					id: 'Tree replacement (natural mortality)',
					unit_cost: tree_costs.unit_cost,
					units: '$/tree',
					qty: Math.round(treeQty * 0.1),
					get present_value() {
						return this.unit_cost / (1.02 ** 3);
					},
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Tree planting (by hand)',
					unit_cost: 1.50,
					units: '$/tree',
					qty: Math.round(treeQty * 0.1),
					get present_value() {
						return this.unit_cost / (1.02 ** 3);
					},
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
			],
		};
		const totalTreeReplacementCosts = calcTotalCosts(tree_replacement_costs);
		tree_replacement_costs.costs.push({
			id: 'Total Tree Replacement Costs',
			totalCost: totalTreeReplacementCosts,
		});

		// Opportunity costs
		const {
			properties: {
				csr = [],
				rent,
				configs: {
					pasture_conversion,
				},
			},
		} = reportArea;
		const opportunity_cost = {
			title: 'Opportunity Costs',
			labels: ['Opportunity Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			costs: [
				pasture_conversion
					? {
						id: 'Land rent pasture',
						unit_cost: 51.00,
						units: '$/acre',
						qty,
						get present_value() {
							return annualSeries(this.unit_cost, 0.02, 15);
						},
						get totalCost() {
							const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
							const totalCost = annualizedPVCost * this.qty;
							return totalCost;
						},
					}
					: {
						id: 'Land rent row crop (non-irrigated)',
						unit_cost: findAverage(csr) * rent,
						units: '$/acre',
						qty,
						get present_value() {
							return annualSeries(this.unit_cost, 0.02, 15);
						},
						get totalCost() {
							const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
							const totalCost = annualizedPVCost * this.qty;
							return totalCost;
						},
					},
			],
		};

		const totalOpportunityCost = calcTotalCosts(opportunity_cost);
		opportunity_cost.costs.push({
			id: 'Total Opportunity Costs',
			totalCost: totalOpportunityCost,
		});

		// EQIP
		const {
			properties: {
				rowLength,
			},
		} = reportArea;
		const eqip = findTreeEQIP(reportArea.properties);
		const eqip_costs = {
			labels: ['Conservation Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			title: 'EQIP',
		};
		eqip_costs.costs = getEQIPCosts(eqip, qty, treeQty, rowLength);
		const totalEQIPCosts = calcTotalCosts(eqip_costs) || 0;
		eqip_costs.costs.push({
			id: 'Total EQIP Costs',
			totalCost: totalEQIPCosts,
		});

		// Net Totals
		const netTotals = {
			title: 'Net Totals',
			labels: ['Category', null, null, null, 'Annualized Total Costs'],
			costs: [
				{
					id: 'Site Preparation',
					totalCost: totalSitePrepCost,
				},
				{
					id: 'Inputs',
					totalCost: totalInputCosts,
				},
				{
					id: 'Tree Establishment',
					totalCost: totalEstablishmentCosts,
				},
				{
					id: 'Tree Replacement',
					totalCost: totalTreeReplacementCosts,
				},
				{
					id: 'Opportunity Cost',
					totalCost: totalOpportunityCost,
				},
				{
					id: 'EQIP',
					totalCost: -(totalEQIPCosts),
				},
			],
		};

		const totalNetCosts = calcTotalCosts(netTotals);
		netTotals.costs.push({
			id: 'Net Annualized Total Cost',
			totalCost: totalNetCosts,
		});

		const reportData = [site_prep, inputs, tree_establishment, tree_replacement_costs, opportunity_cost, eqip_costs, netTotals];
		debug('Tree report data:', reportData);
		return reportData;
	}

	calcPrairieReportData = (reportArea) => {
		debug('Preparing report data for feature:', reportArea);
		const {
			properties: {
				acreage,
			},
		} = reportArea;

		// Site Preparation Costs
		const site_prep = {
			title: 'Site Preparation',
			labels: ['Site Preparation Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			costs: [
				{
					id: 'Tillage',
					unit_cost: 15.50,
					units: '$/acre',
					qty: acreage,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Herbicide Product & Application',
					unit_cost: 44.37,
					units: '$/acre',
					qty: acreage,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
			],
		};
		const totalSitePrepCost = calcTotalCosts(site_prep);
		site_prep.costs.push({
			id: 'Site Preparation Total Cost',
			totalCost: totalSitePrepCost,
		});

		// Establishment Costs
		const establishment = {
			title: 'Establishment',
			labels: ['Establishment Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			costs: [
				{
					id: 'Seed',
					unit_cost: reportArea.properties.configs.seed_price || 0,
					units: '$/acre',
					qty: acreage,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Seed Drilling',
					unit_cost: 18.70,
					units: '$/acre',
					qty: acreage,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Culitpacking',
					unit_cost: 20.00,
					units: '$/acre',
					qty: acreage,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
			],
		};
		const totalEstablishmentCosts = calcTotalCosts(establishment);
		establishment.costs.push({
			id: 'Total Establishment Costs',
			totalCost: totalEstablishmentCosts,
		});

		// Management Costs
		const management = {
			title: 'Management',
			labels: ['Management Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
		};
		let management_row2;
		let management_row3;
		const management_row1 = {
			id: 'Mowing (year 1: 3x)',
			unit_cost: 57.45,
			get present_value() {
				const unitCost = this.unit_cost;
				const present_value = annualSeries(unitCost, 0.02, 1);
				return present_value;
			},
			units: '$/acre',
			qty: acreage,
			get totalCost() {
				const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
				const totalCost = annualizedPVCost * this.qty;
				return totalCost;
			},
		};
		if (reportArea.properties.configs.management.display === 'mow') {
			management_row2 = {
				id: 'Mowing, Raking, Rowing, Baleing (year 2-15)',
				unit_cost: 50.30,
				get present_value() {
					const unitCost = this.unit_cost;
					const present_value = (annualSeries(unitCost, 0.02, 14) / (1.02 ** 2));
					return present_value;
				},
				units: '$/acre',
				qty: acreage,
				get totalCost() {
					const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
					const totalCost = annualizedPVCost * this.qty;
					return totalCost;
				},
			};
		} else if (reportArea.properties.configs.management.display === 'burn') {
			management_row2 = {
				id: 'Burning (year 2-6)',
				unit_cost: 65.00,
				get present_value() {
					const unitCost = this.unit_cost;
					const present_value = (annualSeries(unitCost, 0.02, 4) / (1.02 ** 2));
					return present_value;
				},
				units: '$/acre',
				qty: acreage,
				get totalCost() {
					const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
					const totalCost = annualizedPVCost * this.qty;
					return totalCost;
				},
			};
			management_row3 = {
				id: 'Burning (year 8, 10, 12, 14)',
				unit_cost: 65.00,
				get present_value() {
					return (this.unit_cost / (1.02 ** 8)) + (this.unit_cost / (1.02 ** 10)) + (this.unit_cost / (1.02 ** 12)) + (this.unit_cost / (1.02 ** 14));
				},
				units: '$/acre',
				qty: acreage,
				get totalCost() {
					const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
					const totalCost = annualizedPVCost * this.qty;
					return totalCost;
				},
			};
		}
		management.costs = [management_row1, management_row2, management_row3];
		const totalManagementCosts = calcTotalCosts(management);
		management.costs.push({
			id: 'Total Management Costs',
			totalCost: totalManagementCosts,
		});

		// Opportunity Costs
		const {
			properties: {
				rent,
				csr = [],
			},
		} = reportArea;
		const average_csr = findAverage(csr);
		const opportunity_cost = {
			title: 'Opportunity Cost',
			labels: ['Opportunity Costs', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			costs: [
				{
					id: 'Land Rent (year 1-15)',
					unit_cost: (average_csr * rent),
					units: '$/acre',
					qty: acreage,
					get present_value() {
						const unitCost = this.unit_cost;
						const present_value = annualSeries(unitCost, 0.02, 15);
						return present_value;
					},
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'General Operation Costs (year 1-15)',
					unit_cost: 10.00,
					units: '$/acre',
					qty: acreage,
					get present_value() {
						const unitCost = this.unit_cost;
						const present_value = annualSeries(unitCost, 0.02, 15);
						return present_value;
					},
					get totalCost() {
						const annualizedPVCost = annualizedCost(this.present_value, 0.02, 15);
						const totalCost = annualizedPVCost * this.qty;
						return totalCost;
					},
				},
			],
		};
		const totalOpportunityCost = calcTotalCosts(opportunity_cost);
		opportunity_cost.costs.push({
			id: 'Total Opportunity Costs',
			totalCost: totalOpportunityCost,
		});

		// Conservation Program
		const totalSitePrepUnitCosts = site_prep.costs.map(cost => cost.unit_cost || 0).reduce((a, b) => a + b, 0);
		const totalEstablishmentUnitCosts = establishment.costs.map(cost => cost.unit_cost || 0).reduce((a, b) => a + b, 0);
		const conservationProgram = {
			title: 'Conservation Programs',
			labels: ['Conservation Reserve Program (CP 43)', 'Unit Costs', 'Units', 'Qty', 'Annualized Total Costs'],
			costs: [
				{
					id: 'Cost Share 50% (year 1)',
					unit_cost: ((totalSitePrepUnitCosts + totalEstablishmentUnitCosts) * 0.5),
					units: '$/acre',
					qty: acreage,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
				{
					id: 'Rent Payment (year 1-15)',
					unit_cost: (opportunity_cost.costs[0].present_value * 0.9),
					units: '$/acre',
					qty: acreage,
					get totalCost() {
						const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
						const totalCost = annualizedUnitCost * this.qty;
						return totalCost;
					},
				},
			],
		};

		const incentivePayment = {
			id: 'Incentive Payment (37.5% annual rent)',
			unit_cost: (average_csr * rent * 0.375),
			units: '$/acre',
			qty: acreage,
			get totalCost() {
				const annualizedUnitCost = annualizedCost(this.unit_cost, 0.02, 15);
				const totalCost = annualizedUnitCost * this.qty;
				return totalCost;
			},
		};

		conservationProgram.costs.push(incentivePayment);

		const totalConservationCosts = calcTotalCosts(conservationProgram);
		conservationProgram.costs.push({
			id: 'Total Conservation',
			totalCost: totalConservationCosts,
		});

		// Net Totals
		const netTotals = {
			title: 'Net Totals',
			labels: ['Category', null, null, null, 'Annualized Total Costs'],
			costs: [
				{
					id: 'Site Preparation',
					totalCost: totalSitePrepCost,
				},
				{
					id: 'Establishment',
					totalCost: totalEstablishmentCosts,
				},
				{
					id: 'Management',
					totalCost: totalManagementCosts,
				},
				{
					id: 'Opportunity Cost',
					totalCost: totalOpportunityCost,
				},
				{
					id: 'Conservation Programs',
					totalCost: -(totalConservationCosts),
				},
			],
		};

		const totalNetCosts = calcTotalCosts(netTotals);
		netTotals.costs.push({
			id: 'Net Annualized Total Cost',
			totalCost: totalNetCosts,
		});

		const reportData = [site_prep, establishment, management, opportunity_cost, conservationProgram, netTotals];
		debug('Prairie report data:', reportData);
		return reportData;
	}

	handleTabClick = (event) => {
		const updateactiveTable = event.target.textContent;
		this.setState(() => ({ activeTable: updateactiveTable }));
	}

	handleDownloadSHP = async () => {
		const date = new Date();
		const features = this.props.features.reduce((arr, ea) => {
			const {
				acreage,
				label,
				type,
			} = ea.properties;

			if (type === 'tree') {
				const {
					configs: {
						rows,
						stock_size,
					},
					rows: treeRowGeos,
				} = ea.properties;

				return arr.concat(treeRowGeos.map((row, i) => {
					const rowInfo = rows[i];
					const treeType = (_.keyBy(treeTypes, 'id')[rowInfo.type] || {}).value;
					const treeSpecies = (_.keyBy(treeList, 'id')[rowInfo.species] || {}).display;
					const stockSize = (_.keyBy(treeStockSizes, 'id')[stock_size] || {}).value;
					return {
						...row,
						properties: {
							label: `${label} Row ${i + 1}`,
							species: treeSpecies,
							stock_size: stockSize,
							type: treeType,
						},
					};
				}));
			}

			const {
				bufferAcreage,
				configs: {
					seed,
				},
			} = ea.properties;

			const buffer = _.cloneDeep(ea.properties.buffer || {});
			buffer.properties = {
				...buffer.properties,
				label: `Buffer for ${label}`,
			};

			const seedMix = (seedMixes.find(where => where.id === seed) || {}).display;
			const prairie = {
				...ea,
				properties: {
					acreage,
					bufferAcreage,
					label,
					seed_mix: seedMix,
				},
			};
			return arr.concat([prairie, buffer]);
		}, []);
		debug(features);

		function writeDataToBuffer(feature) {
			return new Promise(resolve => {
				const geoType = feature.geometry.type === 'LineString' ? 'POLYLINE' : 'POLYGON';
				const data = [feature.properties];
				const geometries = [feature.geometry.coordinates];

				shpwrite.write(
					data,
					geoType,
					geometries,
					(err, files) => {
						resolve([feature, files]);
					},
				);
			});
		}

		const promises = features.map(writeDataToBuffer);
		const allFiles = await Promise.all(promises);
		const zip = new JSZip();
		const name = `prairie_tree_planting_tool_report_${date.getTime()}`;
		const folder = zip.folder(name);
		allFiles.forEach(ea => {
			const feature = ea[0];
			const files = ea[1];
			const subFolder = folder.folder(feature.properties.label);
			subFolder.file(`${feature.properties.label.replace(/\s/g, '_')}.shp`, Buffer.from(files.shp.buffer));
			subFolder.file(`${feature.properties.label.replace(/\s/g, '_')}.shx`, Buffer.from(files.shx.buffer));
			subFolder.file(`${feature.properties.label.replace(/\s/g, '_')}.dbf`, Buffer.from(files.dbf.buffer));
		});
		const zipFile = await zip.generateAsync({ type: 'blob' });
		download(zipFile, `${name}.zip`);
	}

	handleDownloadXLSX = () => {
		const book = spreadsheet(this.props.features);
		const date = new Date();
		book.xlsx.writeBuffer()
			.then(buf => download(buf, `prairie_tree_planting_tool_report_${date.getTime()}.xlsx`));
	}

	render() {
		const {
			handleDownloadSHP,
			handleDownloadXLSX,
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
		return reportArea ? (
			<div className="Report">
				<div className="reportActions">
					<div className="wrapper">
						<div className="distribute">
							<img src="../assets/left-arrow.svg" alt="Back to Map" />
							<Link to="/" className="map-link">Back to Map</Link>
						</div>
						<button type="button" onClick={handleDownloadXLSX}>
							<div className="distribute reportAction">
								<img src="../assets/download_xls.svg" alt="Download XLSX file" />
								<p>Download XLSX File</p>
							</div>
						</button>
						<button type="button" onClick={handleDownloadSHP}>
							<div className="distribute reportAction">
								<img src="../assets/download_shapefile.svg" alt="Download Shapefile" />
								<p>Download Shapefile</p>
							</div>
						</button>
					</div>
				</div>
				<div className="reportText">
					<p className="header-large">Cost Report</p>
					<p>Below is your economic report for planting your tree area. You can use any of the options above to print, email or download your report.</p>
				</div>
				{
					features.length > 0 && (
						<>
							<div className="reportArea flex-column">
								<div className="selectWrap flex-column">
									<span className="inputLabel">View Report Area</span>
									<select value={this.state.reportArea.properties.label} onChange={(e) => this.handleReportAreaChange(e)}>
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
		) : null;
	}
}
