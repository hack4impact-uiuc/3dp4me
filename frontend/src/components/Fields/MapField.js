import React, { useState, useCallback, mapRef, useRef, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from "react-map-gl-geocoder";
import './MapField.scss';
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYXJjaG5hLTEiLCJhIjoiY2t1aHFubjl2Mmg4aDMwcXAyaW94eHYzcSJ9.qSm9IsfWo2G7CWJrX_kyeA"

export default function MapField() {
    const initialViewport = {
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
        width: '100%',
        height: '100%',
        pitch: 50,
        transitionDuration: 100
    };

    const [viewport, setViewport] = useState(initialViewport);

    const mapRef = useRef()

    const handleGeocoderViewportChange = viewport => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
      console.log("Updating")

      return setViewport({
          ...viewport,
          ...geocoderDefaultOverrides
        });
    }

    return (
        <div className="mapStyling">
            <h3>Patient Location</h3>

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
}
