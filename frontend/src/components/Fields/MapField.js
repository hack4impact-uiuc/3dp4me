import React, { useState, useRef } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';

import './MapField.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { COORDINATES, PIN_URL, MAPBOX_TOKEN } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';

export default function MapField() {
    const initialViewport = {
        latitude: COORDINATES.DEFAULT_MAP_LAT,
        longitude: COORDINATES.DEFAULT_MAP_LONG,
        zoom: 8,
        width: '100%',
        height: '100%',
        pitch: 50,
        transitionDuration: 100,
    };

    const [viewport, setViewport] = useState(initialViewport);

    const mapRef = useRef();

    const handleGeocoderViewportChange = (viewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 };

        return setViewport({
            ...viewport,
            ...geocoderDefaultOverrides,
        });
    };

    const translations = useTranslations()[0];

    return (
        <div className="mapStyling">
            <h3>{translations.components.map.patientLocation}</h3>

            <ReactMapGL
                ref={mapRef}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                mapboxApiAccessToken={MAPBOX_TOKEN}
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
                        src={PIN_URL}
                        width={viewport.zoom * 5}
                        height={viewport.zoom * 5}
                        alt="Location marker"
                    />
                </Marker>

                <button
                    type="button"
                    className="resetButton"
                    onClick={() => setViewport(initialViewport)}
                >
                    {translations.components.map.reset}
                </button>

                <Geocoder
                    mapRef={mapRef}
                    onViewportChange={handleGeocoderViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    position="top-left"
                />
            </ReactMapGL>

            <div className="coordinateLabel">
                {translations.components.map.latitude}:{' '}
                {viewport?.latitude.toFixed(4)}{' '}
                {translations.components.map.longitude}:{' '}
                {viewport?.longitude.toFixed(4)}
            </div>
        </div>
    );
}
