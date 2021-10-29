import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './MapField.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {
    COORDINATES,
    PIN_URL,
    MAPBOX_TOKEN,
    MAP_STYLE,
} from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';

const MapField = ({
    value,
    initValue,
    displayName,
    isDisabled,
    onChange,
    fieldId,
}) => {
    /**
     * Viewport to which the map is initialized and reset.
     * Updated alongside the location saved in the DB.
     */
    const initialViewport = useMemo(
        () => ({
            latitude: initValue?.latitude || COORDINATES.DEFAULT_MAP_LAT,
            longitude: initValue?.longitude || COORDINATES.DEFAULT_MAP_LONG,
            zoom: 17,
            transitionDuration: 100,
        }),
        [initValue],
    );

    const [viewport, setViewport] = useState(initialViewport);
    const [isDragging, setIsDragging] = useState(false);
    const mapRef = useRef();
    const translations = useTranslations()[0];

    /**
     * Conversely, updates viewport when value changed.
     * Important for automatically resetting the viewport when clicking Discard.
     */
    useEffect(() => {
        const newViewport = _.cloneDeep(viewport);
        newViewport.latitude = value?.latitude || COORDINATES.DEFAULT_MAP_LAT;
        newViewport.longitude =
            value?.longitude || COORDINATES.DEFAULT_MAP_LONG;
        setViewport(newViewport);
    }, [value]);

    /**
     * Update value to the current viewport lat/long upon the end of a drag.
     * Update on drag end to minimize unnecessary network updates.
     */
    useEffect(() => {
        if (isDragging) return;

        const coordinates = {
            latitude: viewport?.latitude,
            longitude: viewport?.longitude,
        };

        onChange(fieldId, coordinates);
    }, [isDragging]);

    const updateViewport = (newView) => {
        if (isDisabled) return;

        setViewport(newView);
    };

    /**
     * Standard Geocoder method, not written by me.
     * Provides for updating viewport after selecting search result.
     */
    const handleGeocoderViewportChange = (newView) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 };

        return setViewport({
            ...newView,
            ...geocoderDefaultOverrides,
        });
    };

    return (
        <div className="mapStyling">
            <h3>{displayName}</h3>

            <ReactMapGL
                ref={mapRef}
                mapStyle={MAP_STYLE}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                latitude={viewport?.latitude}
                longitude={viewport?.longitude}
                zoom={viewport?.zoom}
                width="100%"
                height="100%"
                pitch={50}
                onViewportChange={updateViewport}
                onLoad={() => setViewport(initialViewport)}
                getCursor={(cursor) => {
                    setIsDragging(cursor.isDragging);
                }}
            >
                <Marker
                    latitude={viewport?.latitude}
                    longitude={viewport?.longitude}
                    offsetLeft={viewport?.zoom * -2.5}
                    offsetTop={viewport?.zoom * -5}
                >
                    <img
                        src={PIN_URL}
                        width={viewport?.zoom * 5}
                        height={viewport?.zoom * 5}
                        alt="Location marker"
                    />
                </Marker>

                <button
                    type="button"
                    className="resetButton"
                    disabled={isDisabled}
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
};

MapField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string,
    initValue: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }).isRequired,
    value: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }),
    onChange: PropTypes.func,
};

export default MapField;
