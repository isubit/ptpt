import React from 'react';
import _ from 'lodash';
import uuid from 'uuid/v4';

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
				<div className="inputElement desktop-select-s-width spacer-right-3">
					<span className="inputDescriptor">Is this a windbreak?</span>
					<select value={windbreak} onChange={(e) => handleWindbreakChange(e)}>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>
				<div className="inputElement desktop-select-l-width">
					<span className="inputDescriptor nowrap">How many tree rows would you like to plant?</span>
					<select value={numRows} onChange={(e) => handleNumRowChange(e)}>
						{ _.range(1, 11).map(val => <option key={val} value={val}>{val}</option>)}
					</select>
				</div>
				<div className="inputElement desktop-select-s-width spacer-top-1_5">
					{/* <input type="checkbox" name="longest_length_rows" />
					<span>Configure rows to fit the longest length</span> */}
					<span className="inputDescriptor nowrap">Choose a direction to plant your rows in.</span>
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
		pasture_conversion,
		rows,
		handlePastureConversionChange,
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
						<div key={uuid()} className="rowDetails">
							<div className="rowNumber">
								<h4>Row {i + 1}</h4>
							</div>
							<div className="inputElement desktop-select-l-width">
								<span className="inputLabel">Tree Type</span>
								<select value={row.type.display} onChange={(e) => handleRowTypeChange(e, i)}>
									<option value="Type 1">Type 1</option>
									<option value="Type 2">Type 2</option>
									<option value="Type 3">Type 3</option>
								</select>
							</div>
							<div className="inputElement desktop-select-l-width">
								<span className="inputLabel">Tree Species</span>
								<select value={row.species.display} onChange={(e) => handleRowSpeciesChange(e, i)}>
									<option value="Species 1">Species 1</option>
									<option value="Species 2">Species 2</option>
									<option value="Species 3">Species 3</option>
								</select>
							</div>
						</div>
					))
				}
				<div className="checkboxElement">
					<input type="checkbox" name="pasture_conversion" checked={pasture_conversion} onChange={(e) => handlePastureConversionChange(e)} />
					<span className="inline">I&apos;m converting pasture</span>
				</div>
			</div>
		</div>
	);
};

const RowSpacingInput = (props) => {
	const {
		drip_irrigation,
		spacing_trees: {
			value: tree_spacing,
		},
		spacing_rows: {
			value: row_spacing,
		},
		stock_size: {
			display: stock_size,
		},
		handleRowSpacingChange,
		handleTreeSpacingChange,
		handleStockSizeChange,
		handleDripIrrigationChange,
	} = props;

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
						<option value="3">3&apos;</option>
						<option value="4">4&apos;</option>
						<option value="5">5&apos;</option>
					</select>
				</div>
				<div className="inputElement desktop-select-s-width">
					<span className="inputLabel">Spacing Between Trees</span>
					<select
						value={tree_spacing}
						onChange={(e) => handleTreeSpacingChange(e)}
					>
						<option value="3">3&apos;</option>
						<option value="4">4&apos;</option>
						<option value="5">5&apos;</option>
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
