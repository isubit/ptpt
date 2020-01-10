import programs from 'references/programs.json';
import treeTypes from 'references/tree_types.json';

export function annualSeries(cost, interest, years) {
	const numerator = ((1 + interest) ** years) - 1;
	const denominator = interest * ((1 + interest) ** years);
	const value = cost * (numerator / denominator);
	return value;
}
export function calcTotalCosts(obj) {
	return (
		obj.costs.map(cost => {
			const costTotal = cost.totalCost;
			return costTotal;
		}).reduce((a, b) => {
			const cost = Number(b.substring(1));
			return a + cost;
		}, 0).toFixed(2)
	);
}

export function findTreeEQIP(properties) {
	const {
		configs: {
			irrigation,
			pasture_conversion,
			rows,
			stock_size,
			windbreak,
		},
	} = properties;

	const qualifiedPerRow = rows.map(row => {
		const treeType = (treeTypes.find(where => where.id === row.type) || {});

		if (!treeType.id) {
			return [];
		}

		// If the program has an irrigation requirement, test if it is the same.
		// If the program has a pasture_conversion requirement, test if it is the same.
		// If the program has a rows requirement, test if it is the same.
		// If the program has a stock_size requirement, test if it is the same.
		// If the program has a tree_type requirement, test if it is the same.
		// If the program has a windbreak requirement, test if it is the same.
		return programs.filter(ea => {
			const irrigationCheck = ea.irrigation !== undefined ? ea.irrigation === irrigation : true;
			const pastureConversionCheck = ea.pasture_conversion !== undefined ? ea.pasture_conversion === pasture_conversion : true;
			const rowsCheck = ea.rows !== undefined ? ea.rows === rows.length : true;
			let stockSizeCheck = (Array.isArray(ea.stock_size) ? ea.stock_size.includes(stock_size) : ea.stock_size === stock_size);
			stockSizeCheck = ea.stock_size !== undefined ? stockSizeCheck : true;
			const treeTypeCheck = ea.tree_type !== undefined ? ea.tree_type === treeType.id : true;
			const windbreakCheck = ea.windbreak !== undefined ? ea.windbreak === windbreak : true;

			return irrigationCheck && pastureConversionCheck && rowsCheck && stockSizeCheck && treeTypeCheck && windbreakCheck;
		});
	});

	return qualifiedPerRow;
}
