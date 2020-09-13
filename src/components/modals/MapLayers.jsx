import React from 'react';
import { Link } from 'react-router-dom';

// checkboxElements could probably be factored out into own component.
const DropdownCheckbox = ({
	setBasemap,
	setMapLayer,
	layers,
	basemap,
}) => (
	<div className="dropdown-checkbox">
		<div className="checkboxElement">
			<input type="checkbox" checked={layers.ssurgo} name="ssurgo" onChange={(e) => setMapLayer(e.target.name)} />
			<span>gSSURGO - CSR</span>
		</div>
		<div className="checkboxElement">
			<input type="checkbox" checked={layers.lidar} name="lidar" onChange={(e) => setMapLayer(e.target.name)} />
			<span>LiDAR Hillshade</span>
		</div>
		<div className="checkboxElement">
			<input type="checkbox" checked={layers.contours} name="contours" onChange={(e) => setMapLayer(e.target.name)} />
			<span>2-ft Contours</span>
		</div>
		<div className="checkboxElement">
			<input
				type="checkbox"
				checked={basemap === 'satellite'}
				name="satellite"
				onChange={(e) => {
					e.target.checked ? setBasemap(e.target.name) : setBasemap('outdoor');
				}}
			/>
			<span>Satellite</span>
		</div>
		{basemap === 'satellite' && (
			<div className="satelliteSelection">
				<div className="checkboxElement">
					<input type="radio" name="aerialYear" value="2019" checked={layers.aerialYear === '2019'} onChange={(e) => setMapLayer(e.target.name, e.target.value)} />
					<span>Spring &lsquo;19</span>
				</div>
				<div className="checkboxElement">
					<input type="radio" name="aerialYear" value="2016-2018" checked={layers.aerialYear === '2016-2018'} onChange={(e) => setMapLayer(e.target.name, e.target.value)} />
					<span>Spring &lsquo;16-&lsquo;18</span>
				</div>
			</div>
		)}
		{/* <button type="button" className="Button">
			<span>Add A Map Layer</span>
		</button>
		<img src="/assets/question-mark.svg" alt="Help" /> */}
	</div>
);

export const MapLayers = ({
	basemap,
	layers,
	setBasemap,
	setMapLayer,
	router: {
		location: {
			pathname,
		},
	},
}) => (
	<div className="MapControlModal modal">
		<div className="control-header">
			<Link className="CloseButton" to={pathname}><img className="CloseButton" src="../../assets/close_dropdown.svg" alt="close layers modal" /></Link>
			<h2 className="modal-header">Map Layers</h2>
		</div>
		<div className="control-text">
			<div className="MapLayerDropdowns modal-text">
				<DropdownCheckbox setBasemap={setBasemap} setMapLayer={setMapLayer} layers={layers} basemap={basemap} />
			</div>
		</div>
	</div>
);
