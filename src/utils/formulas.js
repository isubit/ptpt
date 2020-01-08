export function annualSeries(cost, interest, years) {
	const numerator = ((1 + interest) ** years) - 1;
	const denominator = interest * ((1 + interest) ** years);
	const value = cost * (numerator / denominator);
	return value;
}
