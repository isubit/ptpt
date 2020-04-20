import React from 'react';
import mapboxgl from 'mapbox-gl';

export class SSURGOPopup extends React.Component {
	popup = new mapboxgl.Popup({
		closeOnClick: false,
		className: 'SSURGOPopup',
	});

	componentDidMount() {
		const {
			map,
			loadSSURGOPopupData,
		} = this.props;

		this.setLngLat();
		this.setHTML();
		this.popup.addTo(map);

		this.popup.on('close', () => {
			loadSSURGOPopupData(null);
		});
	}

	componentDidUpdate(prevProps) {
		const {
			SSURGOPopupData: {
				feature,
			},
			map,
		} = this.props;
		const {
			SSURGOPopupData: {
				feature: prevFeature,
			},
		} = prevProps;
		const activeFeatureID = feature.properties.OBJECTID;
		const prevFeatureID = prevFeature.properties.OBJECTID;

		if (activeFeatureID !== prevFeatureID) {
			this.setLngLat();
			this.setHTML();
			!this.popup.isOpen() && this.popup.addTo(map);
		}
	}

	componentWillUnmount() {
		this.popup.remove();
	}

	setLngLat() {
		const {
			SSURGOPopupData: {
				lngLat,
			},
		} = this.props;

		this.popup.setLngLat(lngLat);
	}

	setHTML() {
		// create an html string that updates the popup to the details of the SSURGOPopup
		const {
			SSURGOPopupData: {
				feature: {
					properties: {
						musym = 'N/A',
						muname = 'N/A',
						iacornsr = 'N/A',
						compname = 'N/A',
					},
				},
			},
		} = this.props;

		const popupHTML = `
		<div class="mapboxgl-popup-text">
			<h3 class="popup-header">gSSURGO (soils)</h3>
			<div class="popup-group">
				<p class="popup-label">MUKEY</p>
				<p class="popup-info">${musym}</p>
			</div>
			<div class="popup-group light-blue">
				<p class="popup-label">MAPUNIT</p>
				<p class="popup-info">${muname}</p>
			</div>
			<div class="popup-group">
				<p class="popup-label">IA CSR</p>
				<p class="popup-info">${iacornsr}</p>
			</div>
			<div class="popup-group light-blue">
				<p class="popup-label">COMPONENT NAME</p>
				<p class="popup-info">${compname}</p>
			</div>
		</div>
		`;
		this.popup.setHTML(popupHTML);
	}


	render() {
		return null;
	}
}
