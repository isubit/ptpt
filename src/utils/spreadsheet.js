/* eslint-disable no-param-reassign */
import _ from 'lodash';
import Excel from 'exceljs';
import { getOptimalTreePlacements } from 'utils/sources';
import prairieMgmt from 'references/prairie_mgmt.json';
// import treeCost from 'references/tree_cost.json';
import treesList from 'references/trees_list.json';
import treeStockSizes from 'references/tree_stock_sizes.json';
import treeTypes from 'references/tree_types.json';
import seedMixes from 'references/prairie_classification_prices.json';
import {
	// calcTotalCosts,
	findTreeAverageCost,
	findTreeEQIP,
	getEQIPCosts,
} from './reportHelpers';

const treesListMap = _.keyBy(treesList, 'id');

// const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').map(ea => ea.toUpperCase());

// eslint-disable-next-line no-useless-escape
const currency = '"$"#,##0.00;[Red]\-"$"#,##0.00';

// Calculates the present value.
function terminatingAnnualSeriesFormula(valueCell, years, append) {
	return { formula: `$B$4*${valueCell}*(1.02^${years}-1)/(0.02*(1.02^${years}))${append || ''}` };
}

// Use this on the present value to get annualized cost.
function annualizedTotalSeries(valueCell, years, append) {
	return { formula: `${valueCell}*((0.02*(1.02)^${years})/ (((1.02)^${years})-1))${append || ''}` };
}

function prairieTemplate(feature, sheet) {
	const {
		properties: {
			acreage,
			bufferAcreage,
			configs: {
				management,
				seed,
				seed_price,
			},
			csr,
			label,
			rent,
		},
	} = feature;

	// Header
	// Row 1-2
	(() => {
		sheet.addRows([
			['REPORT', label],
			[],
		]);

		sheet.getRow(1).font = { size: 16, bold: true };
	})();

	// Details
	// Rows 3 - 11
	(() => {
		sheet.addRows([
			['Details'],
			['Acreage', acreage.toFixed(2)],
			['Buffer Acreage', bufferAcreage.toFixed(2)],
			['Seed Mix', (seedMixes.find(where => where.id === seed) || {}).display],
			['Seed Mix Price', seed_price],
			['Management', (prairieMgmt.find(where => where.id === management.id) || {}).value], // should be updated to not have id and display
			['Average CSR', (csr && csr.length > 0 ? csr.reduce((a, b) => a + b) / csr.length : 0).toFixed(2)],
			['Land Rent per CSR', rent],
			[],
		]);

		sheet.getRow(3).font = { bold: true, underline: true };
		for (let i = 4, ii = 10; i <= ii; i += 1) {
			sheet.getCell(`A${i}`).font = { italic: true };
		}
		sheet.getCell('B7').numFmt = currency;
		sheet.getCell('B10').numFmt = currency;
	})();

	// Costs
	// Rows 12 - 39
	(() => {
		const rows = [];

		rows.push([
			['Costs', 'Cost per acre', 'Present value total (2% RRR)', 'Annualized cost total (15 years)'],
			// Site Preparation (13 - 17)
			['(1) Site Preparation'],
			['  Tillage', 15.40, { formula: 'B14*$B$4' }, annualizedTotalSeries('C14', 15)],
			['  Herb product', 15.00, { formula: 'B15*$B$4' }, annualizedTotalSeries('C15', 15)],
			['  Herb app.', 53.00, { formula: 'B16*$B$4' }, annualizedTotalSeries('C16', 15)],
			[],
			// Establishment (18 - 22)
			['(2) Establishment'],
			['  Seed', { formula: 'B7' }, { formula: 'B19*$B$4' }, annualizedTotalSeries('C19', 15)],
			['  Seed drilling', 18.00, { formula: 'B20*$B$4' }, annualizedTotalSeries('C20', 15)],
			['  Cultipacking', 20.00, { formula: 'B21*$B$4' }, annualizedTotalSeries('C21', 15)],
			[],
			// Subtotal (23 - 24)
			['Subtotal (1) and (2)', { formula: 'sum(B14:B21)' }, { formula: 'sum(C14:C21)' }, { formula: 'sum(D14:D21)' }],
			[],
		]);

		// Management (25 - 31)
		if (management.id === 'M6z9fsAW') {
			// Burn.
			rows.push([
				['(3) Management'],
				['  Mowing (Year 1: 3x)', 90.00, terminatingAnnualSeriesFormula('B26', 1), annualizedTotalSeries('C26', 15)],
				['  Burning (Year 2-6)', 65.00, terminatingAnnualSeriesFormula('B27', 4, '/(1.02)^2'), annualizedTotalSeries('C27', 15)],
				['  Burning (Year 8, 10, 12, 14)', 65.00, { formula: '$B$4*(B28/(1.02^8))+(B28/(1.02^10))+(B28/(1.02^12))+(B28/(1.02^14))' }, annualizedTotalSeries('C28', 15)],
				[],
				['Subtotal (3)', { formula: 'sum(B26:B28)' }, { formula: 'sum(C26:C28)' }, { formula: 'sum(D26:D28)' }],
				[],
			]);
		} else if (management.id === 'J8wEfx7P') {
			// Mow.
			rows.push([
				['(3) Management'],
				['  Mowing (Year 1: 3x)', 90.00, terminatingAnnualSeriesFormula('B26', 1), annualizedTotalSeries('C26', 15)],
				['  Mowing (Year 2-15)', 30.00, terminatingAnnualSeriesFormula('B27', 14, '/(1.02)^2'), annualizedTotalSeries('C27', 15)],
				['  Raking, Rowing, Baleing (Year 2-15)', 35.85, terminatingAnnualSeriesFormula('B28', 14, '/(1.02)^2'), annualizedTotalSeries('C28', 15)],
				[],
				['Subtotal (3)', { formula: 'sum(B26:B28)' }, { formula: 'sum(C26:C28)' }, { formula: 'sum(D26:D28)' }],
				[],
			]);
		}

		// Opportunity Cost (32 - 37)
		rows.push([
			['(4) Opportunity Cost'],
			['  Land Rent (Year 1-15)', { formula: 'B9*B10' }, terminatingAnnualSeriesFormula('B33', 15), annualizedTotalSeries('C33', 15)],
			['  General Operation Costs (Year 1-15)', 8.00, terminatingAnnualSeriesFormula('B34', 15), annualizedTotalSeries('C34', 15)],
			[],
			['Subtotal (4)', { formula: 'sum(B33:B34)' }, { formula: 'sum(C33:C34)' }, { formula: 'sum(D33:D34)' }],
			[],
		]);

		// Total Costs (38 - 39)
		rows.push([
			['Total Costs', '', '', { formula: 'D23+D30+D36' }],
			[],
		]);

		sheet.addRows(_.flatten(rows));
		sheet.getCell('A12').font = { bold: true, underline: true };
		for (let i = 13, ii = 37; i <= ii; i += 1) {
			sheet.getCell(`A${i}`).font = { italic: true };
		}
		sheet.getCell('A38').font = { bold: true };
	})();

	// Conservation Program
	// Rows 40 - 46
	(() => {
		sheet.addRows([
			['Conservation Programs'],
			['Conservation Reserve Program'],
			['  Cost Share 90%', '', { formula: 'C23*0.9' }, { formula: 'D23*0.9' }],
			['  Rent Payment', '', { formula: 'C33*0.9' }, { formula: 'D33*0.9' }],
			[],
			['Total Cost Share', '', { formula: 'sum(C42:C43)' }, { formula: 'sum(D42:D43)' }],
			[],
		]);

		sheet.getCell('A40').font = { bold: true, underline: true };
		for (let i = 41, ii = 43; i <= ii; i += 1) {
			sheet.getCell(`A${i}`).font = { italic: true };
		}
		sheet.getCell('A45').font = { bold: true };
	})();

	// Net Cost (47)
	sheet.addRow(['Net Cost', '', { formula: 'C38-C45' }, { formula: 'D38-D45' }]);

	sheet.getCell('A47').font = { bold: true, underline: true };

	for (let i = 13, ii = 47; i <= ii; i += 1) {
		sheet.getCell(`B${i}`).numFmt = currency;
		sheet.getCell(`C${i}`).numFmt = currency;
		sheet.getCell(`D${i}`).numFmt = currency;
	}

	sheet.getColumn('A').width = 40;
	sheet.getColumn('A').alignment = { horizontal: 'left' };
	sheet.getColumn('B').width = 20;
	sheet.getColumn('B').alignment = { horizontal: 'left' };
	sheet.getColumn('C').width = 30;
	sheet.getColumn('C').alignment = { horizontal: 'left' };
	sheet.getColumn('D').width = 30;
	sheet.getColumn('D').alignment = { horizontal: 'left' };
}

function treeTemplate(feature, sheet) {
	const {
		properties: {
			acreage,
			configs: {
				drip_irrigation,
				pasture_conversion,
				rows: treeRows,
				stock_size,
				spacing_rows,
				spacing_trees,
				windbreak,
			},
			csr,
			label,
			rent,
			rowLength,
		},
	} = feature;

	const stockSize = (_.keyBy(treeStockSizes, 'id')[stock_size] || {}).value;
	const rowTreeTypes = treeRows.map(ea => (_.keyBy(treeTypes, 'id')[ea.type] || {}).value);
	const rowTreeSpecies = treeRows.map(ea => (treesListMap[ea.species] || {}).display);
	const avgTreePrice = findTreeAverageCost(treeRows, stock_size);
	const treeQty = getOptimalTreePlacements(feature).length;
	const eqip = findTreeEQIP(feature.properties);
	const eqipValues = getEQIPCosts(eqip, acreage, treeQty, rowLength);

	// Header
	// Row 1-2
	(() => {
		sheet.addRows([
			['REPORT', label],
			[],
		]);

		sheet.getRow(1).font = { size: 16, bold: true };
	})();

	// Details
	// Rows 3 - 17
	(() => {
		sheet.addRows([
			['Details'],
			['Acreage', acreage.toFixed(2)],
			['Windbreak', windbreak ? 'Yes' : 'No'],
			['Pasture conversion', pasture_conversion ? 'Yes' : 'No'],
			['Drip irrigation', drip_irrigation ? 'Yes' : 'No'],
			['Stock size', stockSize],
			['Row spacing', `${spacing_rows.value} ${spacing_rows.unit}`],
			['Tree spacing', `${spacing_trees.value} ${spacing_trees.unit}`],
			['Row tree types', ...rowTreeTypes],
			['Row tree species', ...rowTreeSpecies],
			['Average tree price', avgTreePrice],
			['Total number of trees', treeQty],
			['Average CSR', (csr && csr.length > 0 ? csr.reduce((a, b) => a + b) / csr.length : 0).toFixed(2)],
			['Land Rent per CSR', rent],
			[],
		]);

		sheet.getRow(3).font = { bold: true, underline: true };
		for (let i = 4, ii = 16; i <= ii; i += 1) {
			sheet.getCell(`A${i}`).font = { italic: true };
		}

		sheet.getCell('B13').numFmt = currency;
		sheet.getCell('B16').numFmt = currency;
	})();

	// Costs
	// Rows 18 - 32
	(() => {
		const rows = [];

		rows.push([
			['Costs', 'Cost per unit', 'Present value total (2% RRR)', 'Annualized cost total (15 years)'],
			// Site Preparation (19 - 22)
			['(1) Site Preparation'],
			['  Chisel plow', 18.35, { formula: 'B20*$B$4' }, annualizedTotalSeries('C20', 15)],
			['  Tandem disk', 15.40, { formula: 'B21*$B$4' }, annualizedTotalSeries('C21', 15)],
			[],
			// Inputs (23 - 32)
			['(2) Inputs'],
			['  Princep (pre-emergent herbicide)', 3.75, { formula: '(B24/1.02^(4/12))*$B$4' }, annualizedTotalSeries('C24', 15)],
			['  Ground sprayer (pre-emergent)', 7.25, { formula: '(B25/1.02)*$B$4' }, annualizedTotalSeries('C25', 15)],
			['  Poast (post-emergent herbicide)', 11.32, { formula: '(B26/1.02^(4/12))*$B$4' }, annualizedTotalSeries('C26', 15)],
			['  Boom sprayer (post-emergent)', 7.25, { formula: '(B27/1.02)*$B$4' }, annualizedTotalSeries('C27', 15)],
			['  Granular Urea (50 lb N/ac)', 28.00, { formula: '(B28/1.02^(5/12))*$B$4' }, annualizedTotalSeries('C28', 15)],
			['  Fertilizer spreader', 7.30, { formula: '(B29/1.02)*$B$4' }, annualizedTotalSeries('C29', 15)],
			['  Monitoring (Spring)', 3.00, terminatingAnnualSeriesFormula('B30', 15), annualizedTotalSeries('C30', 15)],
			['  Monitoring (Summer)', 3.00, terminatingAnnualSeriesFormula('B31', 15), annualizedTotalSeries('C31', 15)],
			[],
		]);

		// Tree Establishment
		// Rows 33 - 37
		rows.push([
			['(3) Tree Establishment'],
			['  Trees (planting stock)', avgTreePrice, terminatingAnnualSeriesFormula('B34', 1, '/$B$4*$B$14'), annualizedTotalSeries('C34', 15)],
			stock_size === 'MncAVRtr'
				? ['  Tree planting (bareroot)', 220.00, terminatingAnnualSeriesFormula('B35', 1), annualizedTotalSeries('C35', 15)]
				: ['  Tree planting (containerized)', 1.50, terminatingAnnualSeriesFormula('B35', 1, '/$B$4*$B$14'), annualizedTotalSeries('C35', 15)],
			['  Plastic mulch', 450.00, terminatingAnnualSeriesFormula('B36', 1), annualizedTotalSeries('C36', 15)],
			[],
		]);

		// Tree Replacement
		// Rows 38 - 41
		rows.push([
			['(4) Tree Replacement'],
			['  Tree replacement (natural mortality)', avgTreePrice, { formula: 'B39*$B$14*0.1/(1.02^3)' }, annualizedTotalSeries('C39', 15)],
			['  Tree planting (by hand)', 1.50, { formula: 'B40*$B$14*0.1/(1.02^3)' }, annualizedTotalSeries('C40', 15)],
			[],
		]);

		// Opportunity Cost
		// Rows 42 - 44
		rows.push([
			['(5) Opportunity Cost'],
			pasture_conversion
				? ['  Land Rent, pasture (Year 1-15)', 51, terminatingAnnualSeriesFormula('B43', 15), annualizedTotalSeries('C43', 15)]
				: ['  Land Rent, row crop, non-irrigated (Year 1-15)', { formula: 'B15*B16' }, terminatingAnnualSeriesFormula('B43', 15), annualizedTotalSeries('C43', 15)],
			[],
		]);

		// Total Costs
		// Rows 45 - 46
		rows.push([
			['Total Costs', '', '', { formula: 'sum(D20:D43)' }],
			[],
		]);

		sheet.addRows(_.flatten(rows));
		sheet.getCell('A17').font = { bold: true, underline: true };
		for (let i = 18, ii = 44; i <= ii; i += 1) {
			sheet.getCell(`A${i}`).font = { italic: true };
		}
		sheet.getCell('A45').font = { bold: true };
	})();

	// EQIP
	// Rows 47 - ...
	let totalEqipColumn;
	(() => {
		sheet.addRows([
			['EQIP'],
			...eqipValues.map((ea, i) => ([`  ${ea.id}`, ea.unit_cost, '', { formula: `(B${48 + i}/1.02)*${ea.qty}` }])),
			[],
			['Total EQIP', '', '', { formula: `sum(D48:D${48 + eqipValues.length - 1})` }],
			[],
		]);

		totalEqipColumn = 48 + eqipValues.length - 1 + 2;

		sheet.getCell('A47').font = { bold: true, underline: true };
		for (let i = 48, ii = 48 + eqipValues.length - 1; i <= ii; i += 1) {
			sheet.getCell(`A${i}`).font = { italic: true };
		}
		sheet.getCell(`A${totalEqipColumn}`).font = { bold: true };
	})();

	// Net Cost
	const netCostColumn = totalEqipColumn + 2;
	// Waiting for confirmation on annualization of EQIP.
	// sheet.addRow(['Net Cost', '', '', { formula: `D45-D${totalEqipColumn}` }]);

	sheet.getCell(`A${netCostColumn}`).font = { bold: true, underline: true };

	for (let i = 18, ii = netCostColumn; i <= ii; i += 1) {
		sheet.getCell(`B${i}`).numFmt = currency;
		sheet.getCell(`C${i}`).numFmt = currency;
		sheet.getCell(`D${i}`).numFmt = currency;
	}

	sheet.getColumn('A').width = 40;
	sheet.getColumn('A').alignment = { horizontal: 'left' };
	sheet.getColumn('B').width = 20;
	sheet.getColumn('B').alignment = { horizontal: 'left' };
	sheet.getColumn('C').width = 30;
	sheet.getColumn('C').alignment = { horizontal: 'left' };
	sheet.getColumn('D').width = 30;
	sheet.getColumn('D').alignment = { horizontal: 'left' };
}

export function spreadsheet(features) {
	const book = new Excel.Workbook();

	features.forEach(feature => {
		const {
			label,
			type,
		} = feature.properties;

		const sheet = book.addWorksheet(label);
		if (type === 'tree') {
			treeTemplate(feature, sheet);
		} else if (type === 'prairie') {
			prairieTemplate(feature, sheet);
		}
	});

	return book;
}
