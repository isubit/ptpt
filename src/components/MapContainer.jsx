import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from 'react-router-dom';

mapboxgl.accessToken = process.env.mapbox_api_key;

export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.mapElement = React.createRef();
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapElement.current,
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [-93.624287, 41.587537],
            zoom: 13
        });
    }

    render() {
        return (
            <React.Fragment>
                <Route path="/welcome" render={() => <h4>Welcome! Get Started...</h4>}/>
                <div className="Map" ref={this.mapElement}></div>
            </React.Fragment>
        );
    }
};