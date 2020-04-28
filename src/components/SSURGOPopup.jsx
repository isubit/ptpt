/* eslint-disable no-unused-vars */
import React from 'react';
import mapboxgl from 'mapbox-gl';
import calcBbox from '@turf/bbox';

export class SSURGOPopup extends React.Component {
	popup = new mapboxgl.Popup({
		closeOnClick: false,
		className: 'SSURGOPopup',
		// closeOnMove: true,
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
			this.setHTML();
			this.setLngLat();
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
			map,
			updatePosition,
			SSURGOPopupData: {
				feature: {
					properties: {
						OBJECTID = 'N/A',
						muname = 'N/A',
						iacornsr = 'N/A',
						compname = 'N/A',
					},
					geometry,
				},
			},
		} = this.props;

		// popup container
		const popupHTML = document.createElement('div');
		popupHTML.classList.add('mapboxgl-popup-text');

		// popup text
		const popupText = `
		<h3 class="popup-header">gSSURGO (soils)</h3>
		<div class="popup-group">
			<p class="popup-label">MUKEY</p>
			<p class="popup-info">${OBJECTID}</p>
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
		`;

		// zoom button
		const zoomDiv = document.createElement('div');
		zoomDiv.classList.add('popup-group');
		const zoomBtn = document.createElement('a');
		zoomBtn.classList.add('modal-link', 'zoom');
		zoomBtn.addEventListener('click', () => {
			const bbox = calcBbox(geometry);
			map.fitBounds(bbox, {
				duration: 400,
				padding: 100,
			});
			updatePosition();
		});
		const zoomText = document.createTextNode('zoom to');
		zoomBtn.appendChild(zoomText);
		zoomDiv.appendChild(zoomBtn);

		popupHTML.innerHTML = popupText;
		popupHTML.append(zoomDiv);

		this.popup.setDOMContent(popupHTML);
	}


	render() {
		return null;
	}
}
