import React from 'react';

import prairieClassificationPrices from 'references/prairie_classification_prices.json';
import prairieMgmt from 'references/prairie_mgmt.json';

const SeedMixInput = (props) => {
	// value and handlers
	const {
		series,
		seed,
		seed_price,
		handleSeedMixChange,
		handleSeedPriceChange,
	} = props;

	const moistureClasses = [...new Set([...series.values()].map(ea => ea.moisture))]; // Moisture classifications without duplicate.

	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<h1>1</h1>
			</div>
			<div className="configInputs">
				<p className="inputDescriptor">Choose your seed mix.</p>
				<div className="inputElement desktop-select-l-width">
					<span className="inputLabel">Seed Mix</span>
					<select
						value={seed}
						onChange={(e) => {
							const seedPrice = (prairieClassificationPrices.find(where => where.id === e.target.value) || {}).price || 0;
							handleSeedMixChange(e);
							handleSeedPriceChange(seedPrice);
						}}
					>
						<option value="" disabled>Select a seed mix</option>
						{moistureClasses.map(type => {
							const seedPrices = prairieClassificationPrices.filter(where => where.type === type);
							if (seedPrices.length === 0) {
								return null;
							}

							return (
								<optgroup key={type} label={type}>
									{seedPrices.map(ea => <option key={ea.id} value={ea.id}>{ea.display}: ${ea.price.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')}</option>)}
								</optgroup>
							);
						})}
						<optgroup label="Use a custom seed mix">
							<option value="custom">custom</option>
						</optgroup>
					</select>
				</div>
				<div className="inputElement">
					<span className="inputLabel">{seed === 'custom' ? 'Enter ' : ''}Price Per Acre</span>
					{
						seed === 'custom'
							? <input type="text" className="ModalTextInput" value={seed_price} onChange={(e) => handleSeedPriceChange(e)} />
							: <span className="SeedPrice">{Number(seed_price) ? `$${seed_price.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')}` : 'Unknown'}</span>
					}
					{/* <input type="text" className="ModalTextInput" value={seed.price.value} onChange={(e) => handleSeedPriceChange(e)} readOnly={seed.value !== 'custom'} /> */}
				</div>
			</div>
		</div>
	);
};

const PrairieMgmt1 = (props) => {
	const {
		management,
		handleManagementChange,
	} = props;
	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<h1>2</h1>
			</div>
			<div className="configInputs">
				<p className="inputDescriptor">Choose a way to manage your prairie.</p>
				<div className="inputElement desktop-select-l-width">
					<span className="inputLabel">Prairie Management</span>
					<select value={management} onChange={(e) => handleManagementChange(e)}>
						<option value="" disabled>Select a management method</option>
						{prairieMgmt.map(ea => <option key={ea.id} value={ea.id}>{ea.value}</option>)}
					</select>
				</div>
			</div>
		</div>
	);
};

const PrairieMgmt2 = (props) => {
	const {
		cropping_system,
		pest_control,
		handlePestControlChange,
		handleCroppingChange,
	} = props;
	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<h1>3</h1>
			</div>
			<div className="configInputs">
				<p className="inputDescriptor">Choose a cropping system and pest control that you plan on using in the adjacent fields.</p>
				<div className="inputElement desktop-select-l-width">
					<span className="inputLabel">Cropping System</span>
					<select value={cropping_system} onChange={(e) => handleCroppingChange(e)}>
						<option value="Corn Rotation">Corn Rotation</option>
						<option value="Cropping System 2">Cropping System 2</option>
						<option value="Cropping System 3">Cropping System 3</option>
					</select>
				</div>
				<div className="inputElement desktop-select-l-width">
					<span className="inputLabel">Pest Control</span>
					<select value={pest_control} onChange={(e) => handlePestControlChange(e)}>
						<option value="Pest Control">Pest Control</option>
						<option value="Pest Control 2">Pest Control 2</option>
						<option value="Pest Control 3">Pest Control 3</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export const PrairiePlantingForm = (props) => {
	const {
		editingFeature,
		step,
		seed,
		seed_price,
		management,
		cropping_system,
		pest_control,
		handleSeedMixChange,
		handlePestControlChange,
		handleManagementChange,
		handleCroppingChange,
		handleSeedPriceChange,
	} = props;

	const series = editingFeature.properties.series ? new Map(editingFeature.properties.series) : new Map();

	return (
		<>
			<div className="PlantingFormHeader">
				<h2 className="modal-header">Configure your prairie planting area below.</h2>
				{series.size > 0 && <p className="SoilTypes spacer-top-1">Your soil types: <span>{[...series.keys()].sort().toString().replace(/,/g, ', ')}</span></p>}
			</div>
			<SeedMixInput series={series} seed={seed} seed_price={seed_price} handleSeedMixChange={handleSeedMixChange} handleSeedPriceChange={handleSeedPriceChange} />
			{
				(step === 'mgmt_1' || step === 'mgmt_2') && (
					<PrairieMgmt1 management={management} handleManagementChange={handleManagementChange} />
				)
			}
			{
				(step === 'mgmt_2') && (
					<PrairieMgmt2 pest_control={pest_control} cropping_system={cropping_system} handlePestControlChange={handlePestControlChange} handleCroppingChange={handleCroppingChange} />
				)
			}
		</>
	);
};
