import programs from 'references/programs.json';
import treeList from 'references/trees_list.json';
import treeCosts from 'references/tree_cost.json';
// import treeStockSizes from 'references/tree_stock_sizes.json';
import treeTypes from 'references/tree_types.json';

export function annualSeries(cost, interest, years) {
	const numerator = ((1 + interest) ** years) - 1;
	const denominator = interest * ((1 + interest) ** years);
	const value = cost * (numerator / denominator);
	return value;
}

export function annualizedCost(cost, interest, years) {
	const numerator = interest * ((1 + interest) ** years);
	const denominator = ((1 + interest) ** years) - 1;
	const value = cost * (numerator / denominator);
	return value;
}

export function calcTotalCosts(costObj) {
	return costObj.costs.map(cost => cost.totalCost).reduce((a, b) => a + b, 0);
}

export function findAverage(numArr) {
	return (numArr.reduce((a, b) => a + b, 0) / numArr.length) || 0;
}

export function findTreeAverageCost(rows, stock_size) {
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
	return avgTreePrice;
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

export function getEQIPCosts(programArr, qty, treeQty, rowLength) {
	const costs = programArr.map((ea, index) => {
		if (ea.length === 0) {
			return {
				id: `Row ${index + 1} (Does not qualify)`,
				unit_cost: 0,
				qty: 0,
				units: 'N/A',
				totalCost: 0,
			};
		}
		let programCost;
		if (ea.length > 1) {
			const totalCostArr = [];
			const totalCostPrograms = ea.map(program => {
				let totalCost;
				if (program.price_model === 'tree') {
					totalCost = program.price * treeQty;
				} else if (program.price_model === 'acre') {
					totalCost = program.price * qty;
				} else if (program.price_model === 'feet') {
					totalCost = program.price * rowLength;
				}
				totalCostArr.push(totalCost);
				return {
					...program,
					totalCost,
				};
			});
			const largestTotal = Math.max(...totalCostArr);
			const bestProgram = totalCostPrograms.find(program => program.totalCost === largestTotal);
			programCost = {
				id: `Row ${index + 1} (${bestProgram.display})`,
				unit_cost: bestProgram.price,
				units: `$/${bestProgram.price_model}`,
				get present_value() {
					return this.unit_cost / 1.02;
				},
			};
			switch (bestProgram.price_model) {
				case 'tree':
					programCost.qty = treeQty;
					break;
				case 'acre':
					programCost.qty = qty;
					break;
				case 'feet':
					programCost.qty = (rowLength * 3.28084);
					break;
				default:
					break;
			}
			programCost.totalCost = annualizedCost(programCost.present_value, 0.02, 15) * programCost.qty;
		}
		programCost = {
			id: `Row ${index + 1} (${ea[0].display})`,
			unit_cost: ea[0].price,
			units: `$/${ea[0].price_model}`,
			get present_value() {
				return this.unit_cost / 1.02;
			},
		};
		switch (ea[0].price_model) {
			case 'tree':
				programCost.qty = treeQty;
				break;
			case 'acre':
				programCost.qty = qty;
				break;
			case 'feet':
				programCost.qty = (rowLength * 3.28084);
				break;
			default:
				break;
		}
		programCost.totalCost = annualizedCost(programCost.present_value, 0.02, 15) * programCost.qty;

		return programCost;
	});

	return costs;
}
