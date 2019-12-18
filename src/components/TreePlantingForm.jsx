import React from 'react';

const NumRowInput = (props) => {
	const {
		windbreak,
		numRows,
		handleNumRowChange,
		handleWindbreakChange,
		handlePropgationChange,
		propagation,
	} = props;

	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<h1>1</h1>
			</div>
			<div className="configInputs">
				<div className="inputElement desktop-select-s-width">
					<span className="inputDescriptor">Is this a windbreak?</span>
					<span className="inputLabel">Windbreak</span>
					<select value={windbreak ? 'Yes' : 'No'} onChange={(e) => handleWindbreakChange(e)}>
						<option>Yes</option>
						<option>No</option>
					</select>
				</div>
				<div className="inputElement desktop-select-l-width">
					<span className="inputDescriptor">How many tree rows would you like to plant?</span>
					<span className="inputLabel">Tree Rows</span>
					<select value={numRows} onChange={(e) => handleNumRowChange(e)}>
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
						<option>6</option>
						<option>7</option>
						<option>8</option>
						<option>9</option>
						<option>10</option>
					</select>
				</div>
				<div className="inputElement desktop-select-s-width">
					{/* <input type="checkbox" name="longest_length_rows" />
					<span>Configure rows to fit the longest length</span> */}
					<span className="inputDescriptor">Choose a direction to plant your rows in.</span>
					<span className="inputLabel">Direction</span>
					<select
						value={propagation}
						onChange={(e) => handlePropgationChange(e)}
					>
						<option value="N">North</option>
						<option value="S">South</option>
						<option value="W">West</option>
						<option value="E">East</option>
					</select>
				</div>
			</div>
		</div>
	);
};

const RowDetailInput = (props) => {
	const {
		rows,
		handleRowTypeChange,
		handleRowSpeciesChange,
	} = props;
	// build the controlled input fields
	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<h1>2</h1>
			</div>
			<div className="configInputs">
				<p className="inputDescriptor">Choose a tree type and species for each row. Below are the recommended tree types and species based on your soil. You can change these by choosing a different option in each dropdown.</p>
				{
					rows.map((row, i) => (
						<div className="rowDetails">
							<div className="rowNumber">
								<h4>Row {i + 1}</h4>
							</div>
							<div className="inputElement desktop-select-l-width">
								<span className="inputLabel">Tree Type</span>
								<select value={row.type.display} onChange={(e) => handleRowTypeChange(e, i)}>
									<option>Type 1</option>
									<option>Type 2</option>
									<option>Type 3</option>
								</select>
							</div>
							<div className="inputElement desktop-select-l-width">
								<span className="inputLabel">Tree Species</span>
								<select value={row.species.display} onChange={(e) => handleRowSpeciesChange(e, i)}>
									<option>Species 1</option>
									<option>Species 2</option>
									<option>Species 3</option>
								</select>
							</div>
						</div>
					))
				}
			</div>
		</div>
	);
};

const RowSpacingInput = (props) => {
	const {
		drip_irrigation,
		stock_size: {
			display: stock_size,
		},
		handleRowSpacingChange,
		handleTreeSpacingChange,
		handleStockSizeChange,
		handleDripIrrigationChange,
	} = props;
	let {
		spacing_trees: {
			value: tree_spacing,
		},
		spacing_rows: {
			value: row_spacing,
		},
	} = props;

	switch (row_spacing) {
		case 3:
			row_spacing = '3\'';
			break;
		case 4:
			row_spacing = '4\'';
			break;
		case 5:
			row_spacing = '5\'';
			break;
		default:
			break;
	}

	switch (tree_spacing) {
		case 3:
			tree_spacing = '3\'';
			break;
		case 4:
			tree_spacing = '4\'';
			break;
		case 5:
			tree_spacing = '5\'';
			break;
		default:
			break;
	}

	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<h1>3</h1>
			</div>
			<div className="configInputs">
				<p className="inputDescriptor">Choose the spacing you need in between the trees and what size you plan on purchasing the plantings. Recommendations based on your soil type and slope percentage are prefilled.</p>
				<div className="inputElement desktop-select-s-width">
					<span className="inputLabel">Spacing Between Rows</span>
					<select
						value={row_spacing}
						onChange={(e) => handleRowSpacingChange(e)}
					>
						<option>3&apos;</option>
						<option>4&apos;</option>
						<option>5&apos;</option>
					</select>
				</div>
				<div className="inputElement desktop-select-s-width">
					<span className="inputLabel">Spacing Between Trees</span>
					<select
						value={tree_spacing}
						onChange={(e) => handleTreeSpacingChange(e)}
					>
						<option>3&apos;</option>
						<option>4&apos;</option>
						<option>5&apos;</option>
					</select>
				</div>
				<div className="inputElement desktop-select-m-width">
					<span className="inputLabel">Planting Stock Size</span>
					<select value={stock_size} onChange={(e) => handleStockSizeChange(e)}>
						<option>Stock Size 1</option>
						<option>Stock Size 2</option>
						<option>Stock Size 3</option>
					</select>
				</div>
				<div className="checkboxElement">
					<input type="checkbox" name="drip_irrigation" checked={drip_irrigation} onChange={(e) => handleDripIrrigationChange(e)} />
					<span className="inline">I&apos;m using drip irrigation</span>
				</div>
			</div>
		</div>
	);
};

export const TreePlantingForm = (props) => {
	const {
		step,
		windbreak,
		propagation,
		rows,
		spacing_trees,
		spacing_rows,
		stock_size,
		drip_irrigation,
		handleTreeSpacingChange,
		handleDripIrrigationChange,
		handleRowSpeciesChange,
		handleRowTypeChange,
		handleNumRowChange,
		handleRowSpacingChange,
		handleStockSizeChange,
		handleWindbreakChange,
		handlePropgationChange,
	} = props;
	return (
		<>
			<h2 className="modal-header">Configure your tree rows below.</h2>
			<NumRowInput windbreak={windbreak} propagation={propagation} numRows={rows.length} handleNumRowChange={handleNumRowChange} handleWindbreakChange={handleWindbreakChange} handlePropgationChange={handlePropgationChange} />
			{
				(step === 'species' || step === 'spacing') && (
					<RowDetailInput rows={rows} handleRowTypeChange={handleRowTypeChange} handleRowSpeciesChange={handleRowSpeciesChange} />
				)
			}
			{
				(step === 'spacing') && (
					<RowSpacingInput spacing_trees={spacing_trees} spacing_rows={spacing_rows} stock_size={stock_size} drip_irrigation={drip_irrigation} handleRowSpacingChange={handleRowSpacingChange} handleTreeSpacingChange={handleTreeSpacingChange} handleStockSizeChange={handleStockSizeChange} handleDripIrrigationChange={handleDripIrrigationChange} />
				)
			}
		</>
	);
};
