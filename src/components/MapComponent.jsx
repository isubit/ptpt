import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from 'react-router-dom';

import { MapConsumer } from 'contexts/MapState';
import areaLayer from 'map_layers/area.json';

mapboxgl.accessToken = process.env.mapbox_api_key;

//wrapped here because it will be cleaner to pass in props than passing it in app.jsx file
export const MapWrapper = props => {
    return (
        <MapConsumer>
            {mapCtx => {
                const ctx = {...mapCtx.state, ...mapCtx.actions};
                return <MapComponent {...ctx} {...props} />
            }}
        </MapConsumer>
    );
};


export class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setup: false,
            geojsonInput: '',
            sources: []
        };
        this.mapElement = React.createRef();
    }

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapElement.current,
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [-93.624287, 41.587537],
            zoom: 13
        });

        this.map.on('load', () => {
            if (this.state.setup) {
                return false;
            }

            this.loadSources();
            this.loadLayers();
            this.setState({
                setup: true
            });
            console.log('Map loaded:', this.map);
        });
    }

    componentDidUpdate() {
        if (this.state.setup) {
            this.loadSources();
        }
    }

    addSource(name, type, data) {
        if (this.state.sources.includes(name)) {
            // Update the source.
            const source = this.map.getSource(name);
            source.setData(data);
        } else {
            // Add the source.
            this.map.addSource(name, {
                type,
                data
            });
            this.setState({
                sources: this.state.sources.concat(name)
            });
        }
    }

    loadSources() {
        const { data = [] } = this.props;
        let features = [];
        data.forEach((ea, i) => {
            if (ea.type == 'Feature') {
                features.push(ea);
            } else if (ea.type == 'FeatureCollection') {
                features = features.concat(ea.features);
            }
        });
        this.addSource('feature_data', 'geojson', {
            type: 'FeatureCollection',
            features
        });
    }

    loadLayers() {
        this.map.addLayer(areaLayer);
    }

    inputOnChange = event => {
        this.setState({
            geojsonInput: event?.target?.value
        });
    }

    render() {
        return (
            <React.Fragment>
                <Route path="/welcome" render={() => <h4>Welcome! Get Started...</h4>}/>
                <textarea value={this.state.geojsonInput} onChange={this.inputOnChange} style={{width: '400px', height: '400px'}}/>
                <button onClick={() => this.props.addData(this.state.geojsonInput)}>Add GeoJSON</button>
                <div className="Map" ref={this.mapElement}></div>
            </React.Fragment>
        );
    }
};