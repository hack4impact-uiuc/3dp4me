import React, { useState, useCallback, mapRef, useRef, useEffect, useMemo } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from "react-map-gl-geocoder";
import _ from "lodash";

import './MapField.scss';
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { COORDINATES, PIN_URL, MAPBOX_TOKEN } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';

const MapField = ({ displayName, isDisabled, fieldId, initValue, value, onChange}) => {

    // Base Viewport, set to location saved in DB
    const initialViewport = useMemo (() => ({
        latitude: initValue?.latitude || COORDINATES.DEFAULT_MAP_LAT,
        longitude: initValue?.longitude || COORDINATES.DEFAULT_MAP_LONG,
        zoom: 17, // increase zoom?
        transitionDuration: 100
    }), [initValue]);

    // Update current viewport as value is updated
    useEffect(() => {
      const newViewport = _.cloneDeep(viewport);
      newViewport.latitude = value?.latitude || COORDINATES.DEFAULT_MAP_LAT; // do i need the or here?
      newViewport.longitude = value?.longitude || COORDINATES.DEFAULT_MAP_LONG;
      setViewport(newViewport);
    }, [value]);

    // Update value after the end of each drag
    const [isDragging, setIsDragging] = useState(false);
    useEffect(() => {
      if (isDragging) return;

      const coordinates = {
        latitude: viewport.latitude,
        longitude: viewport.longitude
      }

      onChange(fieldId, coordinates);
    }, [isDragging]);

    // Initialize and update viewport (local representation)
    const [viewport, setViewport] = useState(initialViewport);
    const updateViewport = (newView) => {
      if (isDisabled) return;

      setViewport(newView);
    };

    const mapRef = useRef()

    const handleGeocoderViewportChange = viewport => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
      console.log("Updating")

      return setViewport({
          ...viewport,
          ...geocoderDefaultOverrides
        });
    }

    const translations = useTranslations()[0];

    return (
        <div className="mapStyling">
            <h3>{translations.components.map.patientLocation}</h3>

            <ReactMapGL
                ref={mapRef}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                mapboxApiAccessToken={MAPBOX_TOKEN}
                latitude={viewport?.latitude}
                longitude={viewport?.longitude}
                zoom={viewport?.zoom}
                width={'100%'}
                height={'100%'}
                pitch={50}
                onViewportChange={updateViewport}
                onLoad={() => setViewport(initialViewport)}
                getCursor={(cursor) => {
                  setIsDragging(cursor.isDragging)
                }}
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
                  disabled = {isDisabled}
                  onClick={() => setViewport(initialViewport)}
              >
                  {translations.components.map.reset}
              </button>

              <Geocoder
                  mapRef={mapRef}
                  onViewportChange={handleGeocoderViewportChange}
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  position='top-left'
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

export default MapField;
