import React, { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import './MapField.scss';

export default function MapField() {
    const initialViewport = {
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
        width: '100%',
        height: '100%',
        pitch: 50,
    };

    const [viewport, setViewport] = useState(initialViewport);

    return (
        <div className="mapStyling">
            <h3>Patient Location</h3>
            <button
                type="button"
                className="resetButton"
                onClick={() => setViewport(initialViewport)}
            >
                Reset
            </button>
            <ReactMapGL
                mapStyle="mapbox://styles/mapbox/dark-v9"
                mapboxApiAccessToken="pk.eyJ1IjoiYXJjaG5hLTEiLCJhIjoiY2t1aHFubjl2Mmg4aDMwcXAyaW94eHYzcSJ9.qSm9IsfWo2G7CWJrX_kyeA"
                {...viewport}
                onViewportChange={(newView) => setViewport(newView)}
            >
                <Marker
                    latitude={viewport?.latitude}
                    longitude={viewport?.longitude}
                    offsetLeft={viewport.zoom * -2.5}
                    offsetTop={viewport.zoom * -5}
                >
                    <img
                        src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                        width={viewport.zoom * 5}
                        height={viewport.zoom * 5}
                        alt="Location marker"
                    />
                </Marker>
            </ReactMapGL>

            <div className="coordinateLabel">
                Latitude: {viewport?.latitude.toFixed(4)} Longitude:{' '}
                {viewport?.longitude.toFixed(4)}
            </div>
        </div>
    );
}
