/* eslint-disable no-param-reassign */
import _ from 'lodash';
import Excel from 'exceljs';
import prairieMgmt from 'references/prairie_mgmt.json';
import seedMixes from 'references/prairie_classification_prices.json';

// eslint-disable-next-line no-useless-escape
const currency = '"$"#,##0.00;[Red]\-"$"#,##0.00';

function terminatingAnnualSeriesFormula(valueCell, years, append) {
	return { formula: `$B$4*${valueCell}*(1.02^${years}-1)/(0.02*(1.02^${years}))${append || ''}` };
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
			['Average CSR', csr && csr.length > 0 ? csr.reduce((a, b) => a + b) / csr.length : 0],
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
			['Costs', 'Cost per acre', 'Line item cost'],
			// Site Preparation (13 - 17)
			['(1) Site Preparation'],
			['  Tillage', 15.40, { formula: 'B14*$B$4' }],
			['  Herb product', 15.00, { formula: 'B15*$B$4' }],
			['  Herb app.', 53.00, { formula: 'B16*$B$4' }],
			[],
			// Establishment (18 - 22)
			['(2) Establishment'],
			['  Seed', { formula: 'B7' }, { formula: 'B19*$B$4' }],
			['  Seed drilling', 18.00, { formula: 'B20*$B$4' }],
			['  Cultipacking', 20.00, { formula: 'B21*$B$4' }],
			[],
			// Subtotal (23 - 24)
			['Subtotal (1) and (2)', { formula: 'sum(B14:B21)' }, { formula: 'sum(C14:C21)' }],
			[],
		]);

		// Management (25 - 31)
		if (management.id === 'M6z9fsAW') {
			// Burn.
			rows.push([
				['(3) Management'],
				['  Mowing (Year 1: 3x)', 90.00, terminatingAnnualSeriesFormula('B26', 1)],
				['  Burning (Year 2-6)', 65.00, terminatingAnnualSeriesFormula('B27', 4, '/(1.02)^2')],
				['  Burning (Year 8, 10, 12, 14)', 65.00, { formula: '$B$4*(B28/(1.02^8))+(B28/(1.02^10))+(B28/(1.02^12))+(B28/(1.02^14))' }],
				[],
				['Subtotal (3)', { formula: 'sum(B26:B28)' }, { formula: 'sum(C26:C28)' }],
				[],
			]);
		} else if (management.id === 'J8wEfx7P') {
			// Mow.
			rows.push([
				['(3) Management'],
				['  Mowing (Year 1: 3x)', 90.00, terminatingAnnualSeriesFormula('B26', 1)],
				['  Mowing (Year 2-15)', 30.00, terminatingAnnualSeriesFormula('B27', 14, '/(1.02)^2')],
				['  Raking, Rowing, Baleing (Year 2-15)', 35.85, terminatingAnnualSeriesFormula('B28', 14, '/(1.02)^2')],
				[],
				['Subtotal (3)', { formula: 'sum(B26:B28)' }, { formula: 'sum(C26:C28)' }],
				[],
			]);
		}

		// Opportunity Cost (32 - 37)
		rows.push([
			['(4) Opportunity Cost'],
			['  Land Rent (Year 1-15)', { formula: 'B9*B10' }, terminatingAnnualSeriesFormula('B33', 15)],
			['  General Operation Costs (Year 1-15)', 8.00, terminatingAnnualSeriesFormula('B34', 15)],
			[],
			['Subtotal (4)', { formula: 'sum(B33:B34)' }, { formula: 'sum(C33:C34)' }],
			[],
		]);

		// Total Costs (38 - 39)
		rows.push([
			['Total Costs', { formula: 'B23+B30+B36' }, { formula: 'C23+C30+C36' }],
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
			['  Cost Share 90%', '', { formula: 'C23*0.9' }],
			['  Rent Payment', '', { formula: 'C33*0.9' }],
			[],
			['Total Cost Share', '', { formula: 'sum(C42:C43)' }],
			[],
		]);

		sheet.getCell('A40').font = { bold: true, underline: true };
		for (let i = 41, ii = 43; i <= ii; i += 1) {
			sheet.getCell(`A${i}`).font = { italic: true };
		}
		sheet.getCell('A45').font = { bold: true };
	})();

	// Net Cost (47)
	sheet.addRow(['Net Cost', '', { formula: 'C38-C45' }]);

	sheet.getCell('A47').font = { bold: true, underline: true };

	for (let i = 13, ii = 47; i <= ii; i += 1) {
		sheet.getCell(`B${i}`).numFmt = currency;
		sheet.getCell(`C${i}`).numFmt = currency;
	}

	sheet.getColumn('A').width = 40;
	sheet.getColumn('A').alignment = { horizontal: 'left' };
	sheet.getColumn('B').width = 20;
	sheet.getColumn('B').alignment = { horizontal: 'left' };
	sheet.getColumn('C').width = 20;
	sheet.getColumn('C').alignment = { horizontal: 'left' };
}

// function treeTemplate(feature, sheet) {

// }

export function spreadsheet(features) {
	const book = new Excel.Workbook();

	features.forEach(feature => {
		const {
			label,
			type,
		} = feature.properties;

		if (type === 'tree') {
			// const sheet = book.addWorksheet(label);
		} else if (type === 'prairie') {
			const sheet = book.addWorksheet(label);
			prairieTemplate(feature, sheet);
		}
	});

	return book;
}
