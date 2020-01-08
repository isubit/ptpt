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
