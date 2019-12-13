import React from 'react';
import { Link } from 'react-router-dom';

// modal is supposed to be reactive to the pathname

const NumRowInput = (props) => {
	const {
		windbreak,
		numRows,
		handleNumRowChange,
		handleWindbreakChange,
		handlePropgationChange,
	} = props;
	let { propagation } = props;

	switch (propagation) {
		case 'N':
			propagation = 'North';
			break;
		case 'S':
			propagation = 'South';
			break;
		case 'W':
			propagation = 'West';
			break;
		case 'E':
			propagation = 'East';
			break;
		default:
			break;
	}

	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<img src="../../assets/step1.svg" alt="Step 1" />
			</div>
			<div className="configInputs">
				<div className="inputElement">
					<span>Is this a windbreak?</span>
					{/* <span className="inputLabel">Tree Rows</span> */}
					<select value={windbreak ? 'Yes' : 'No'} onChange={(e) => handleWindbreakChange(e)}>
						<option>Yes</option>
						<option>No</option>
					</select>
				</div>
				<div className="inputElement">
					<span>How many tree rows would you like to plant?</span>
					<input type="number" min="1" value={numRows} onChange={(e) => handleNumRowChange(e)} />
				</div>
				<div className="inputElement">
					{/* <input type="checkbox" name="longest_length_rows" />
					<span>Configure rows to fit the longest length</span> */}
					<span>Choose a direction to plant your rows in.</span>
					<select
						value={propagation}
						onChange={(e) => handlePropgationChange(e)}
					>
						<option>North</option>
						<option>South</option>
						<option>West</option>
						<option>East</option>
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
				<img src="../../assets/step2.svg" alt="Step 2" />
			</div>
			<div className="formInputs">
				<p>Choose a tree type and species for each row. Below are the recommended tree types and species based on your soil. You can change these by choosing a different option in each dropdown.</p>
				{
					rows.map((row, i) => (
						<div className="rowDetails inputElement">
							<div className="rowNumber">
								<span>Row {i + 1}</span>
							</div>
							<div className="rowInputs">
								<span>Tree Type</span>
								<select value={row.type.display} onChange={(e) => handleRowTypeChange(e, i)}>
									<option>Type 1</option>
									<option>Type 2</option>
									<option>Type 3</option>
								</select>
								<span>Tree Species</span>
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
			row_spacing = '';
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
			tree_spacing = '';
			break;
	}

	return (
		<div className="ConfigForm">
			<div className="formNumber">
				<img src="../../assets/step3.svg" alt="Step 3" />
				<p>Choose the spacing you need in between the trees and what size you plan on purchasing the plantings. Recommendations based on your soil type and slope percentage are prefilled.</p>
			</div>
			<div className="formInputs">
				<div>
					<span>Spacing Between Rows</span>
					<select
						value={row_spacing}
						onChange={(e) => handleRowSpacingChange(e)}
					>
						<option>3&apos;</option>
						<option>4&apos;</option>
						<option>5&apos;</option>
					</select>
				</div>
				<div>
					<span>Spacing Between Trees</span>
					<select
						value={tree_spacing}
						onChange={(e) => handleTreeSpacingChange(e)}
					>
						<option>3&apos;</option>
						<option>4&apos;</option>
						<option>5&apos;</option>
					</select>
				</div>
				<div>
					<span>Planting Stock Size</span>
					<select value={stock_size} onChange={(e) => handleStockSizeChange(e)}>
						<option>Stock Size 1</option>
						<option>Stock Size 2</option>
						<option>Stock Size 3</option>
					</select>
				</div>
				<div>
					<input type="checkbox" name="drip_irrigation" checked={drip_irrigation} />
					<span>I&apos;m using drip irrigation</span>
				</div>
			</div>
		</div>
	);
};

export class TreePlantingModal extends React.Component {
	constructor(props) {
		super(props);
		const {
			editingFeature,
		} = props;

		// const type = editingFeature.properties.type || 'tree';
		const configs = editingFeature.properties.configs || (
			{
				windbreak: null,
				propagation: 'N',
				rows: [],
				spacing_rows: {
					value: null,
					unit: 'feet',
				},
				spacing_trees: {
					value: null,
					unit: 'feet',
				},
				stock_size: {
					id: null,
					display: '',
				},
				drip_irrigation: null,
			}
		);
		this.state = {
			...configs,
			// type,
		};
	}

	componentDidUpdate() {
		// check and determine if the forms are configured fully

	}

	componentDidMount() {
		// initialize first row if editingFeature has not been configured
		if (this.state.rows.length === 0) {
			// const updateRows = this.generateRecommendedRowConfig();
			const updateRows = {
				type: {
					id: 1,
					display: 'Type 1',
				},
				species: {
					id: 15,
					display: 'Species 3',
				},
			};
			this.setState({ rows: [updateRows] }, () => console.log(this.state));
		}
	}

	/* generateRecommendedRowConfig() {
		// depending on soil type generate tree config for row
	} */

	handleNumRowChange = (event) => {
		// add or subtract row objects in the rows array
		const {
			rows,
		} = this.state;

		let updateRows = [];
		if (event.target.value < rows.length) {
			updateRows = rows.splice(0, event.target.value);
			this.setState({ rows: updateRows });
		} else if (event.target.value > rows.length) {
			// create recommended row types and species here
			updateRows = [...rows, {
				type: {
					id: 1,
					display: 'Type 1',
				},
				species: {
					id: 15,
					display: 'Species 3',
				},
			}];
			this.setState({ rows: updateRows });
		}
	}

	handleWindbreakChange = (event) => {
		const updateWindbreak = (event.target.value === 'Yes') || false;
		this.setState({ windbreak: updateWindbreak }, () => console.log(this.state));
	}

	handlePropgationChange = (event) => {
		let updatePropagation;
		switch (event.target.value) {
			case 'North':
				updatePropagation = 'N';
				break;
			case 'South':
				updatePropagation = 'S';
				break;
			case 'West':
				updatePropagation = 'W';
				break;
			case 'East':
				updatePropagation = 'E';
				break;
			default:
				updatePropagation = null;
				break;
		}
		this.setState({ propagation: updatePropagation }, () => console.log(this.state));
	}

	handleRowTypeChange = (event, rowIndex) => {
		const {
			rows,
		} = this.state;
		rows[rowIndex].type.display = event.target.value;
		this.setState({ rows }, () => console.log(this.state));
	}

	handleRowSpeciesChange = (event, rowIndex) => {
		const {
			rows,
		} = this.state;
		rows[rowIndex].species.display = event.target.value;
		this.setState({ rows }, () => console.log(this.state));
	}

	handleRowSpacingChange = (event) => {
		const spacingValue = Number(event.target.value.substring(0, 1));
		this.setState((state) => ({
			spacing_rows: {
				...state.spacing_rows,
				value: spacingValue,
			},
		}), () => console.log(this.state));
	}

	handleTreeSpacingChange = (event) => {
		const spacingValue = Number(event.target.value.substring(0, 1));
		this.setState((state) => ({
			spacing_trees: {
				...state.spacing_trees,
				value: spacingValue,
			},
		}), () => console.log(this.state));
	}

	handleStockSizeChange = (event) => {
		const stockSize = event.target.value;
		this.setState((state) => (
			{
				stock_size: {
					...state.stock_size,
					display: stockSize,
				},
			}
		), () => console.log(this.state));
	}

	/* handleNextStep() {

	} */

	render() {
		const {
			state: {
				windbreak,
				propagation,
				rows,
				// step,
				spacing_trees,
				spacing_rows,
				stock_size,
				drip_irrigation,
			},
		} = this;
		return (
			<div className="modal margin-center">
				<Link to="/"><img className="CloseButton" src="../../assets/close_dropdown.svg" alt="Close Planting Modal" /></Link>
				<h2 className="modal-header">Configure your tree rows below.</h2>
				<div>
					<p>Your soil types:</p>
					<p>LiDAR slope percentage:</p>
				</div>
				<NumRowInput windbreak={windbreak} propagation={propagation} numRows={rows.length} handleNumRowChange={this.handleNumRowChange} handleWindbreakChange={this.handleWindbreakChange} handlePropgationChange={this.handlePropgationChange} />
				<RowDetailInput rows={rows} handleRowTypeChange={this.handleRowTypeChange} handleRowSpeciesChange={this.handleRowSpeciesChange} />
				<RowSpacingInput spacing_trees={spacing_trees} spacing_rows={spacing_rows} stock_size={stock_size} drip_irrigation={drip_irrigation} handleRowSpacingChange={this.handleRowSpacingChange} handleTreeSpacingChange={this.handleTreeSpacingChange} handleStockSizeChange={this.handleStockSizeChange} />
				<div className="button-wrap">
					<div className="Button">
						<span>Next</span>
					</div>
				</div>
			</div>
		);
	}
}
