/* eslint-disable no-else-return */
import React from 'react';
import _ from 'lodash';
import uuid from 'uuid/v4';

import {
	findSlope,
} from 'utils/geometry';

import treesList from 'references/trees_list.json';
import treeTypes from 'references/tree_types.json';
import treeStockSizes from 'references/tree_stock_sizes.json';

const NumRowInput = (props) => {
	const {
		editingFeature,
		windbreak,
		numRows,
		handleNumRowChange,
		handleWindbreakChange,
		handlePropgationChange,
		propagation,
	} = props;

	const slope = findSlope(editingFeature);

	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<h1>1</h1>
			</div>
			<div className="configInputs">
				<div className="inputElement desktop-select-s-width spacer-right-3">
					<span className="inputDescriptor">Is this a windbreak?</span>
					<select value={windbreak} onChange={(e) => handleWindbreakChange(e)} required>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>
				<div className="inputElement desktop-select-l-width">
					<span className="inputDescriptor nowrap">How many tree rows would you like to plant?</span>
					<select value={numRows} onChange={(e) => handleNumRowChange(e)} required>
						{windbreak
							? (
								<>
									<option key={1} value={1}>1</option>
									<option key={3} value={3}>3</option>
								</>
							)
							: _.range(1, windbreak ? 5 : 11).map(val => <option key={val} value={val}>{val}</option>)}
					</select>
				</div>
				<div className="inputElement desktop-select-s-width spacer-top-1_5">
					{/* <input type="checkbox" name="longest_length_rows" />
					<span>Configure rows to fit the longest length</span> */}
					<span className="inputDescriptor nowrap">Choose a direction to add rows from your starting line.</span>
					<select
						value={propagation}
						onChange={(e) => handlePropgationChange(e)}
						required
					>
						{
							slope > 1 || slope < -1
								? (
									<>
										<option value="W">West</option>
										<option value="E">East</option>
									</>
								)
								: (
									<>
										<option value="N">North</option>
										<option value="S">South</option>
									</>
								)
						}
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
		series,
		handlePastureConversionChange,
		handleRowTypeChange,
		handleRowSpeciesChange,
	} = props;

	const csgs = [...new Set([...series.values()].map(ea => ea.csg))]; // CSGs without duplicate.

	const treesByType = treesList.reduce((map, tree) => {
		if (csgs.length > 0 && csgs.every(csg => !tree.csgs.includes(csg))) {
			return map;
		}
		map.set(tree.type, (map.get(tree.type) || []).concat(tree));
		return map;
	}, new Map());

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
								<select value={row.type} onChange={(e) => handleRowTypeChange(e, i)} required>
									<option value="" disabled>Select a tree type</option>
									{treeTypes.map(ea => <option key={ea.id} value={ea.id}>{ea.value}</option>)}
								</select>
							</div>
							<div className="inputElement desktop-select-l-width">
								<span className="inputLabel">Tree Species</span>
								<select value={row.species} onChange={(e) => handleRowSpeciesChange(e, i)} required>
									<option value="" disabled>{!row.type ? 'Select a tree type first' : 'Select a tree species'}</option>
									{treesByType.get(row.type) && treesByType.get(row.type).map(ea => <option key={ea.id} value={ea.id}>{ea.display}</option>)}
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
						required
					>
						<option value="10">10&apos;</option>
						<option value="20">20&apos;</option>
						<option value="30">30&apos;</option>
						<option value="40">40&apos;</option>
						<option value="50">50&apos;</option>
					</select>
				</div>
				<div className="inputElement desktop-select-s-width">
					<span className="inputLabel">Spacing Between Trees</span>
					<select
						value={tree_spacing}
						onChange={(e) => handleTreeSpacingChange(e)}
						required
					>
						<option value="5">5&apos;</option>
						<option value="10">10&apos;</option>
						<option value="15">15&apos;</option>
						<option value="20">20&apos;</option>
						<option value="25">25&apos;</option>
					</select>
				</div>
				<div className="inputElement desktop-select-m-width">
					<span className="inputLabel">Planting Stock Size</span>
					<select value={stock_size} onChange={(e) => handleStockSizeChange(e)} required>
						<option value="" disabled>Select a stock size</option>
						{treeStockSizes.map(ea => (
							<option key={ea.id} value={ea.id}>
								{ea.value.includes('container') ? ea.value.split('_').reduce((str, frag, i) => {
									if (i === 0) {
										return str + frag;
									} else if (i === 1 && frag.includes('over')) {
										return `${str} (${frag} `;
									} else if (i === 1) {
										return `${str} (${frag} - `;
									} else if (i === 2) {
										return `${str}${frag})`;
									} else {
										return `${str} ${frag}`;
									}
								}, '') : ea.value}
							</option>
						))}
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
		form,
		editingFeature,
		step,
		windbreak,
		propagation,
		rows,
		spacing_trees,
		spacing_rows,
		stock_size,
		drip_irrigation,
		pasture_conversion,
		handleTreeSpacingChange,
		handleDripIrrigationChange,
		handleRowSpeciesChange,
		handleRowTypeChange,
		handleNumRowChange,
		handleRowSpacingChange,
		handleStockSizeChange,
		handleWindbreakChange,
		handlePropgationChange,
		handlePastureConversionChange,
	} = props;

	const series = editingFeature.properties.series ? new Map(editingFeature.properties.series) : new Map();

	return (
		<>
			<div className="PlantingFormHeader">
				<h2 className="modal-header">Configure your tree rows below.</h2>
				{series.size > 0 && <p className="SoilTypes spacer-top-1">Your soil types: <span>{[...series.keys()].sort().toString().replace(/,/g, ', ')}</span></p>}
			</div>
			<form ref={form}>
				<NumRowInput editingFeature={editingFeature} windbreak={windbreak} propagation={propagation} numRows={rows.length} handleNumRowChange={handleNumRowChange} handleWindbreakChange={handleWindbreakChange} handlePropgationChange={handlePropgationChange} />
				{
					(step === 'species' || step === 'spacing') && (
						<RowDetailInput series={series} rows={rows} pasture_conversion={pasture_conversion} handleRowTypeChange={handleRowTypeChange} handleRowSpeciesChange={handleRowSpeciesChange} handlePastureConversionChange={handlePastureConversionChange} />
					)
				}
				{
					(step === 'spacing') && (
						<RowSpacingInput spacing_trees={spacing_trees} spacing_rows={spacing_rows} stock_size={stock_size} drip_irrigation={drip_irrigation} handleRowSpacingChange={handleRowSpacingChange} handleTreeSpacingChange={handleTreeSpacingChange} handleStockSizeChange={handleStockSizeChange} handleDripIrrigationChange={handleDripIrrigationChange} />
					)
				}
			</form>
		</>
	);
};
