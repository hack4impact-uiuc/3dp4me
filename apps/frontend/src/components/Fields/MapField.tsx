import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './MapField.scss'

import { MapPoint, Nullish } from '@3dp4me/types'
import _ from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import ReactMapGL, { MapRef, Marker } from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'

import { useTranslations } from '../../hooks/useTranslations'
import { COORDINATES, MAP_STYLE, MAPBOX_TOKEN, PIN_URL } from '../../utils/constants'
import { AdvancedMarker, Map, MapCameraChangedEvent, MapMouseEvent, Pin } from '@vis.gl/react-google-maps'

export interface MapFieldProps {
    value: Nullish<MapPoint>
    initValue: Nullish<MapPoint>
    displayName: string
    isDisabled: boolean
    onChange: (field: string, value: MapPoint) => void
    fieldId: string
}

interface Viewport extends MapPoint {
    zoom: number
    transitionDuration: number
}

const AMMAN_LAT_LNG = {
    lat: 31.9544,
    lng: 35.9106,
}

const DEMO_MAP_ID = 'DEMO_MAP_ID'

const MapField = ({
    value,
    initValue,
    displayName,
    isDisabled,
    onChange,
    fieldId,
}: MapFieldProps) => {
    /**
     * Viewport to which the map is initialized and reset.
     * Updated alongside the location saved in the DB.
     */
    const initialViewport = useMemo<Viewport>(
        () => ({
            latitude: initValue?.latitude || COORDINATES.DEFAULT_MAP_LAT,
            longitude: initValue?.longitude || COORDINATES.DEFAULT_MAP_LONG,
            zoom: 17,
            transitionDuration: 100,
        }),
        [initValue]
    )

    const [viewport, setViewport] = useState(initialViewport)
    const [isDragging, setIsDragging] = useState(false)
    const mapRef = useRef<MapRef | null>(null)
    const translations = useTranslations()[0]

    /**
     * Conversely, updates viewport when value changed.
     * Important for automatically resetting the viewport when clicking Discard.
     */
    useEffect(() => {
        const newViewport = _.cloneDeep(viewport)
        newViewport.latitude = value?.latitude || COORDINATES.DEFAULT_MAP_LAT
        newViewport.longitude = value?.longitude || COORDINATES.DEFAULT_MAP_LONG
        setViewport(newViewport)
    }, [value])

    /**
     * Update value to the current viewport lat/long upon the end of a drag.
     * Update on drag end to minimize unnecessary network updates.
     */
    useEffect(() => {
        if (isDragging) return

        const coordinates = {
            latitude: viewport?.latitude,
            longitude: viewport?.longitude,
        }

        onChange(fieldId, coordinates)
    }, [isDragging])

    const updateViewport = (newView: Viewport) => {
        if (isDisabled) return

        setViewport(newView)
    }

    const addMarker = (event: MapMouseEvent) => {
        console.log("ADDING MARKER ", event)
        if (!event.detail.latLng) return

        onChange(fieldId, {
            latitude: event.detail.latLng.lat,
            longitude: event.detail.latLng.lng,
        })
    }

    /**
     * Standard Geocoder method, not written by me.
     * Provides for updating viewport after selecting search result.
     */
    const handleGeocoderViewportChange = (newView: Viewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 }

        return setViewport({
            ...newView,
            ...geocoderDefaultOverrides,
        })
    }

    const pinForLocation = (lat: number , lng: number) => {
        return (
            <AdvancedMarker
                position={{lat: lat, lng: lng}}>

                <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>
        )
    }

    const displayMap = () => {
        if (isDisabled) {
            const center = !!value ? { lat: value.latitude, lng: value.longitude } : AMMAN_LAT_LNG
            console.log("VALUE IS ", value, "CENTER IS ", center)
            return (
                <Map
                    mapId={DEMO_MAP_ID}
                    defaultZoom={13}
                    defaultCenter={center}
                >
                    {!!value && pinForLocation(value.latitude, value.longitude)}
                </Map>
            )
        }

            return (
                <Map
                    mapId={DEMO_MAP_ID}
                    defaultZoom={13}
                    defaultCenter={ AMMAN_LAT_LNG }
                    onClick={addMarker}
                >
                    {!!value && pinForLocation(value.latitude, value.longitude)}
                </Map>
            )
    }

    return (
        <div className="mapStyling">
            <h3>{displayName}</h3>

            {displayMap()}


            {/* <ReactMapGL
                ref={mapRef}
                mapStyle={MAP_STYLE}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                latitude={viewport?.latitude}
                longitude={viewport?.longitude}
                zoom={viewport?.zoom}
                width="100%"
                height="85%"
                pitch={50}
                onViewportChange={updateViewport}
                onLoad={() => setViewport(initialViewport)}
                getCursor={(cursor) => {
                    setIsDragging(cursor.isDragging)
                    return 'crosshair'
                }}
            >
                <Marker
                    latitude={viewport.latitude}
                    longitude={viewport.longitude}
                    offsetLeft={viewport.zoom * -2.5}
                    offsetTop={viewport.zoom * -5}
                >
                    <img
                        src={PIN_URL}
                        width={viewport.zoom * 2}
                        height={viewport.zoom * 2.5}
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
            </ReactMapGL> */}

            <div className="coordinateLabel">
                {translations.components.map.latitude}: {viewport?.latitude.toFixed(4)}{' '}
                {translations.components.map.longitude}: {viewport?.longitude.toFixed(4)}
            </div>
        </div>
    )
}

export default MapField
