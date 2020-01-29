import React from 'react';
import { Link } from 'react-router-dom';

import prairieClassificationPrices from 'references/prairie_classification_prices.json';
import prairieMgmt from 'references/prairie_mgmt.json';

const SeedMixInput = React.forwardRef((props, ref) => {
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
		<div className="ConfigForm" ref={ref}>
			<div className="stepNumber">
				<h1>1</h1>
			</div>
			<div className="configInputs">
				<p className="inputDescriptor">Choose your seed mix.</p>
				<div className="inputElement desktop-select-l-width desktop-spacer-right-1">
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
				</div>
			</div>
		</div>
	);
});

const PrairieMgmt1 = React.forwardRef((props, ref) => {
	const {
		management,
		handleManagementChange,
	} = props;
	return (
		<div className="ConfigForm" ref={ref}>
			<div className="stepNumber">
				<h1>2</h1>
			</div>
			<div className="configInputs">
				<p className="inputDescriptor">Choose a way to manage your prairie.</p>
				<div className="inputElement desktop-select-l-width">
					<span className="inputLabel">Prairie Management</span>
					<select value={management.id} onChange={(e) => handleManagementChange(e)}>
						<option value="" disabled>Select a management method</option>
						{prairieMgmt.map(ea => <option key={ea.id} value={ea.id}>{ea.value}</option>)}
					</select>
				</div>
			</div>
		</div>
	);
});

const PrairieMgmt2 = React.forwardRef((props, ref) => {
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
			<div className="configInputs" ref={ref}>
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
});

export class PrairiePlantingForm extends React.Component {
	constructor(props) {
		super(props);
		this.seedMixInputEl = React.createRef();
		this.prairieMgmt1El = React.createRef();
		this.prairieMgmt2El = React.createRef();
	}

	componentDidUpdate(prevProps) {
		const { step: prevStep } = prevProps;
		const { step: currentStep } = this.props;
		if (prevStep !== currentStep) {
			if (currentStep === 'mgmt_1') {
				this.scrollToElement(this.prairieMgmt1El);
			}
		}
	}

	scrollToElement = (ref) => {
		ref.current.scrollIntoView({ behavior: 'smooth' });
	}

	render() {
		const {
			form,
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
		} = this.props;

		const series = editingFeature.properties.series ? new Map(editingFeature.properties.series) : new Map();

		return (
			<>
				<div className="PlantingFormHeader">
					<Link className="CloseButton" to="/"><img src="../../assets/close_dropdown.svg" alt="Close Planting Modal" /></Link>
					<h2 className="modal-header">Configure your prairie planting area below.</h2>
					<div className="prairie-area-info spacer-top-1">
						{series.size > 0 && <p className="SoilTypes planting-modal-text">Your soil types: <span>{[...series.keys()].sort().toString().replace(/,/g, ', ')}</span></p>}
						{editingFeature.properties.acreage && <p className="PrairieArea planting-modal-text">Prairie area: <span>{editingFeature.properties.acreage.toFixed(2)} acres</span></p>}
						{editingFeature.properties.bufferAcreage && <p className="BufferArea planting-modal-text">Buffer area: <span>{editingFeature.properties.bufferAcreage.toFixed(2)} acres</span></p>}
					</div>
				</div>
				<form className="form-spacing" ref={form}>
					<SeedMixInput ref={this.seedMixInputEl} series={series} seed={seed} seed_price={seed_price} handleSeedMixChange={handleSeedMixChange} handleSeedPriceChange={handleSeedPriceChange} />
					{
						(step === 'mgmt_1' || step === 'mgmt_2') && (
							<PrairieMgmt1 ref={this.prairieMgmt1El} management={management} handleManagementChange={handleManagementChange} />
						)
					}
					{
						(step === 'mgmt_2') && (
							<PrairieMgmt2 ref={this.prairieMgmt2El} pest_control={pest_control} cropping_system={cropping_system} handlePestControlChange={handlePestControlChange} handleCroppingChange={handleCroppingChange} />
						)
					}
				</form>
			</>
		);
	}
}
