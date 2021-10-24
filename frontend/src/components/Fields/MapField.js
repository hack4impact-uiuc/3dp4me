import React, { useState, useCallback, mapRef, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import _ from "lodash";
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from "react-map-gl-geocoder";
import './MapField.scss';
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYXJjaG5hLTEiLCJhIjoiY2t1aHFubjl2Mmg4aDMwcXAyaW94eHYzcSJ9.qSm9IsfWo2G7CWJrX_kyeA"
const DEFAULT_LAT = 37.11
const DEFAULT_LONG = 127.2

// MARKER NOT IMMEDIATELY DISPLAYING
// RESET NOT WORKING, ALSO WHEN DISCARDING CHANGES. HOW OFTEN ARE DB VALUES UPDATED?
// NEED TO DISABLE RESET WHEN isDisabled
// CURRENTLY, WHEN CALLING RESET ON DISABLED MAP, LAT/LONG UPDATE BUT VIEWPORT DOES NOT
// RESET NOT REFLECTING SAVED VALS, ARE VALS BEING SAVED
// MAP ALL GREYED OUT AFTER MOVE??????
const MapField = forwardRef(({ displayName, isDisabled, fieldId, initValue}, ref) => {

    const [value, setValue] = useState([]);
    useEffect(() => {
      setValue(initValue); // update viewport

      //const newViewport = _.cloneDeep(viewport); // NEED TO UPDATE INIT_VIEWPORT, THEN UPDATE NORMAL VIEWPORT
      initialViewport.latitude = value?.latitude || DEFAULT_LAT; // do i need the or here?
      initialViewport.longitude = value?.longitude || DEFAULT_LONG;
      setViewport(initialViewport);
    }, [initValue]);

    const initialViewport = {
        latitude: initValue?.latitude || DEFAULT_LAT,
        longitude: initValue?.longitude || DEFAULT_LONG,
        zoom: 8,
        width: '100%',
        height: '100%',
        pitch: 50,
        transitionDuration: 100
    };

    const [viewport, setViewport] = useState(initialViewport);

    const sendChanges = (newView) => {
      if (isDisabled) return;

      setViewport(newView);

      const coordinates = {
        latitude: viewport.latitude,
        longitude: viewport.longitude
      }

      setValue(coordinates);
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

    useImperativeHandle(ref, () => ({
       value,
    }));

    return (
        <div className="mapStyling">
            <h3>Patient Location</h3>

            <ReactMapGL
                ref={mapRef}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                mapboxApiAccessToken={MAPBOX_TOKEN}
                {...viewport}
                onViewportChange={sendChanges}
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

              <button
                  type="button"
                  className="resetButton"
                  onClick={() => setViewport(initialViewport)}
              >
                  Reset
              </button>

              <Geocoder
                  mapRef={mapRef}
                  onViewportChange={handleGeocoderViewportChange}
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  position='top-left'
                />
              </ReactMapGL>

            <div className="coordinateLabel">
                Latitude: {viewport?.latitude.toFixed(4)} Longitude:{' '}
                {viewport?.longitude.toFixed(4)}
            </div>
        </div>
    );
})

export default MapField;
