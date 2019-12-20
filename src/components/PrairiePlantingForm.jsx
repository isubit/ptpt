import React from 'react';

const SeedMixInput = (props) => {
	// value and handlers
	const {
		seed,
		handleSeedMixChange,
		handleSeedValueChange,
	} = props;
	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<h1>1</h1>
			</div>
			<div className="configInputs">
				<p className="inputDescriptor">Choose your seed mix.</p>
				<div className="inputElement desktop-select-l-width">
					<span className="inputLabel">Seed Mix</span>
					<select value={seed.value} onChange={(e) => handleSeedMixChange(e)}>
						<option value="Seed Mix 1">Seed Mix 1</option>
						<option value="Seed Mix 2">Seed Mix 2</option>
						<option value="Seed Mix 3">Seed Mix 3</option>
					</select>
				</div>
				<div className="inputElement">
					<span className="inputLabel">Enter Price Per Acre</span>
					<input type="text" className="ModalTextInput" value={seed.price.value} onChange={(e) => handleSeedValueChange(e)} />
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
					<select value={management.display} onChange={(e) => handleManagementChange(e)}>
						<option value="Burning">Burning</option>
						<option value="Mow">Mow</option>
						<option value="Management 3">Management 3</option>
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
					<select value={cropping_system.display} onChange={(e) => handleCroppingChange(e)}>
						<option value="Corn Rotation">Corn Rotation</option>
						<option value="Cropping System 2">Cropping System 2</option>
						<option value="Cropping System 3">Cropping System 3</option>
					</select>
				</div>
				<div className="inputElement desktop-select-l-width">
					<span className="inputLabel">Pest Control</span>
					<select value={pest_control.display} onChange={(e) => handlePestControlChange(e)}>
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
		step,
		seed,
		management,
		cropping_system,
		pest_control,
		handleSeedMixChange,
		handlePestControlChange,
		handleManagementChange,
		handleCroppingChange,
		handleSeedValueChange,
	} = props;
	return (
		<>
			<h2 className="modal-header">Configure your prairie planting area below.</h2>
			<SeedMixInput seed={seed} handleSeedMixChange={handleSeedMixChange} handleSeedValueChange={handleSeedValueChange} />
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
