import React from 'react';
import { Link } from 'react-router-dom';

import { TreePlantingForm } from '../TreePlantingForm';
import { PrairiePlantingForm } from '../PrairiePlantingForm';

export class PlantingModal extends React.Component {
	constructor(props) {
		super(props);
		this.bottom = React.createRef();
		const {
			editingFeature: {
				properties: {
					type,
				},
			},
		} = props;
		let {
			editingFeature: {
				properties: {
					configs = null,
				},
			},
		} = props;

		if (!configs) {
			if (type === 'tree') {
				configs = {
					windbreak: false,
					propagation: 'N',
					rows: [{
						type: '',
						species: '',
					}],
					spacing_rows: {
						value: 3, // placeholder value
						unit: 'feet',
					},
					spacing_trees: {
						value: 3, //  placeholder value
						unit: 'feet',
					},
					stock_size: '',
					drip_irrigation: false,
					pasture_conversion: false,
				};
			} else if (type === 'prairie') {
				configs = {
					seed: {
						id: 14, // placeholder
						value: 'Seed Mix 1', // placeholder
						price: {
							value: '',
							per_unit: 'acre',
							currency: '$_dollar',
						},
					},
					management: {
						id: 1,
						display: 'Mow',
					},
					cropping_system: {
						id: 1,
						display: 'Corn Rotation',
					},
					pest_control: {
						id: 1,
						display: 'Pest Control',
					},
				};
			}
		}
		this.state = {
			...configs,
			stepIndex: 0,
		};
	}

	// componentDidMount() {
	// 	const {
	// 		editingFeature: {
	// 			properties: {
	// 				type,
	// 			},
	// 		},
	// 	} = this.props;
	// }

	componentDidUpdate(prevProps) {
		const { step: prevStep } = prevProps;
		const { step: currentStep } = this.props;
		if (prevStep !== currentStep) {
			this.scrollToBottom();
		}
	}

	handleNumRowChange = (event) => {
		const numRows = event.target.value;
		this.setState((state) => {
			let updateRows = [];
			if (numRows < state.rows.length) {
				updateRows = state.rows.splice(0, numRows);
				return {
					rows: updateRows,
				};
			}
			if (numRows > state.rows.length) {
				updateRows = [...state.rows];
				for (let i = 0; i < numRows - state.rows.length; i += 1) {
					updateRows.push({
						type: '',
						species: '',
					});
				}
				return {
					rows: updateRows,
				};
			}
			return null;
		});
	}

	handleWindbreakChange = (event) => {
		let updateWindbreak = event.target.value;
		if (updateWindbreak === 'true' || updateWindbreak === 'false') {
			updateWindbreak = JSON.parse(updateWindbreak);
		}
		this.setState({ windbreak: updateWindbreak });
	}

	handlePropgationChange = (event) => {
		const updatePropagation = event.target.value;
		this.setState({ propagation: updatePropagation });
	}

	handlePastureConversionChange = (event) => {
		const updateConversion = event.target.value;
		this.setState({ pasture_conversion: updateConversion });
	}

	handleRowTypeChange = (event, rowIndex) => {
		const {
			rows,
		} = this.state;
		rows[rowIndex].type = event.target.value;
		this.setState({ rows });
	}

	handleRowSpeciesChange = (event, rowIndex) => {
		const {
			rows,
		} = this.state;
		rows[rowIndex].species = event.target.value;
		this.setState({ rows });
	}

	handleRowSpacingChange = (event) => {
		const spacingValue = Number(event.target.value);
		this.setState((state) => ({
			spacing_rows: {
				...state.spacing_rows,
				value: spacingValue,
			},
		}));
	}

	handleTreeSpacingChange = (event) => {
		const spacingValue = Number(event.target.value);
		this.setState((state) => ({
			spacing_trees: {
				...state.spacing_trees,
				value: spacingValue,
			},
		}));
	}

	handleStockSizeChange = (event) => {
		const stock_size = event.target.value;
		this.setState(() => ({ stock_size }));
	}

	handleDripIrrigationChange = (event) => {
		const updateDripIrrigation = event.target.checked;
		this.setState({ drip_irrigation: updateDripIrrigation });
	}

	handleSeedMixChange = (event) => {
		const updateSeedMix = event.target.value;
		this.setState((state) => (
			{
				seed: {
					...state.seed,
					value: updateSeedMix,
				},
			}
		));
	}

	handleSeedValueChange = (event) => {
		const updateValue = event.target.value;
		this.setState((state) => (
			{
				seed: {
					...state.seed,
					price: {
						...state.seed.price,
						value: updateValue,
					},
				},
			}
		));
	}

	handleManagementChange = (event) => {
		const updateManagement = event.target.value;
		this.setState((state) => (
			{
				management: {
					...state.management,
					display: updateManagement,
				},
			}
		));
	}

	handleCroppingChange = (event) => {
		const updateCropping = event.target.value;
		this.setState((state) => (
			{
				cropping_system: {
					...state.cropping,
					display: updateCropping,
				},
			}
		));
	}

	handlePestControlChange = (event) => {
		const updatePestControl = event.target.value;
		this.setState((state) => (
			{
				pest_control: {
					...state.pest_control,
					display: updatePestControl,
				},
			}
		));
	}

	scrollToBottom = () => {
		this.bottom.current.scrollIntoView({ behavior: 'smooth' });
	}

	handleNextStep = () => {
		const {
			nextStep,
			steps,
			editingFeature: {
				properties: {
					type,
				},
			},
		} = this.props;

		this.setState((state) => ({
			stepIndex: state.stepIndex + 1,
		}), () => {
			nextStep(`/plant/${type}/${steps[this.state.stepIndex]}`);
		});
	}

	handleSave = () => {
		const {
			props: {
				editingFeature,
				saveFeature,
				setEditingFeature,
				editingFeature: {
					properties: {
						type,
					},
				},
			},
		} = this;

		let properties = {};
		if (type === 'tree') {
			const {
				state: {
					propagation,
					rows,
					spacing_trees,
					spacing_rows,
					stock_size,
					drip_irrigation,
					windbreak,
				},
			} = this;

			properties = {
				type,
				configs: {
					propagation,
					windbreak,
					rows,
					spacing_rows,
					spacing_trees,
					stock_size,
					drip_irrigation,
				},
			};
		} else if (type === 'prairie') {
			const {
				seed,
				management,
				cropping_system,
				pest_control,
			} = this.state;

			properties = {
				type,
				configs: {
					seed,
					management,
					cropping_system,
					pest_control,
				},
			};
		}

		editingFeature.properties = properties;
		setEditingFeature(editingFeature);
		saveFeature();
	}

	render() {
		const {
			props: {
				step,
				editingFeature,
				editingFeature: {
					properties: {
						type,
					},
				},
			},
			state: {
				stepIndex,
			},
		} = this;

		let formProps = {
			editingFeature,
			step,
		};

		if (type === 'tree') {
			const {
				state: {
					windbreak,
					propagation,
					rows,
					spacing_trees,
					spacing_rows,
					stock_size,
					drip_irrigation,
					pasture_conversion,
				},
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
			} = this;

			formProps = {
				...formProps,
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
			};
		} else if (type === 'prairie') {
			const {
				state: {
					seed,
					management,
					cropping_system,
					pest_control,
				},
				handleSeedMixChange,
				handlePestControlChange,
				handleManagementChange,
				handleCroppingChange,
				handleSeedValueChange,
			} = this;

			formProps = {
				...formProps,
				seed,
				management,
				cropping_system,
				pest_control,
				handleSeedMixChange,
				handlePestControlChange,
				handleManagementChange,
				handleCroppingChange,
				handleSeedValueChange,
			};
		}

		return (
			<>
				<div className="modal margin-center">
					<Link className="CloseButton" to="/"><img src="../../assets/close_dropdown.svg" alt="Close Planting Modal" /></Link>
					{ type === 'tree' && <TreePlantingForm {...formProps} /> }
					{ type === 'prairie' && <PrairiePlantingForm {...formProps} /> }
					<div ref={this.bottom} />
				</div>
				<div className="button-wrap vertical-align">
					{
						stepIndex <= 1 && (
							<button
								type="button"
								className="Button"
								onClick={this.handleNextStep}
								onKeyPress={this.handleNextStep}
							>
								<span>Next</span>
							</button>
						)
					}
					{
						stepIndex === 2 && (
							<button
								type="button"
								className="Button"
								onClick={this.handleSave}
								onKeyPress={this.handleSave}
							>
								<span>View Map</span>
							</button>
						)
					}
				</div>
			</>
		);
	}
}
