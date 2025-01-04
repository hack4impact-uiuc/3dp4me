/* global google */
import './MapField.scss'

import { MapPoint, Nullish } from '@3dp4me/types'
import {
    AdvancedMarker,
    ControlPosition,
    Map,
    MapControl,
    MapMouseEvent,
    Pin,
} from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useTranslations } from '../../../hooks/useTranslations'
import { MapHandler } from './MapHandler'
import { PlaceAutocomplete } from './PlaceAutocomplete'

export interface MapFieldProps {
    value: Nullish<MapPoint>
    displayName: string
    isDisabled: boolean
    onChange: (field: string, value: MapPoint) => void
    fieldId: string
}

const AMMAN_LAT_LNG = {
    lat: 31.9544,
    lng: 35.9106,
}

const DEMO_MAP_ID = 'DEMO_MAP_ID'
const AutoCompleteControl = styled.div`
    box-sizing: border-box;
    margin: 24px;
    background: #fff;
`

const MapField = ({ value, displayName, isDisabled, onChange, fieldId }: MapFieldProps) => {
    const translations = useTranslations()[0]
    const [location, setLocation] = useState<Nullish<MapPoint>>(null)

    useEffect(() => {
        setLocation(value || { latitude: AMMAN_LAT_LNG.lat, longitude: AMMAN_LAT_LNG.lng })
    }, [])

    const addMarker = (event: MapMouseEvent) => {
        if (!event.detail.latLng) return

        onChange(fieldId, {
            latitude: event.detail.latLng.lat,
            longitude: event.detail.latLng.lng,
        })
    }

    const onPlaceSelect = (place: Nullish<google.maps.places.PlaceResult>) => {
        const loc = place?.geometry?.location
        if (!loc) return

        const selectedLocation = {
            latitude: loc.lat(),
            longitude: loc.lng(),
        }

        onChange(fieldId, selectedLocation)
        setLocation(selectedLocation)
    }

    const pinForLocation = (lat: number, lng: number) => (
        <AdvancedMarker position={{ lat, lng }}>
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
    )

    const displayMap = () => {
        const center = value ? { lat: value.latitude, lng: value.longitude } : AMMAN_LAT_LNG
        if (isDisabled) {
            return (
                <Map mapId={DEMO_MAP_ID} defaultZoom={13} defaultCenter={center}>
                    {!!value && pinForLocation(value.latitude, value.longitude)}
                </Map>
            )
        }

        return [
            <Map
                key={`${fieldId}-map`}
                mapId={DEMO_MAP_ID}
                defaultZoom={13}
                defaultCenter={center}
                disableDefaultUI={true}
                onClick={addMarker}
            >
                {!!value && pinForLocation(value.latitude, value.longitude)}
            </Map>,
            <MapControl position={ControlPosition.TOP} key={`${fieldId}-map-control`}>
                <AutoCompleteControl>
                    <PlaceAutocomplete onPlaceSelect={onPlaceSelect} />
                </AutoCompleteControl>
            </MapControl>,
            <MapHandler key={`${fieldId}-map-handler`} place={location} />,
        ]
    }

    const getMapLink = () => {
        const lat = value?.latitude
        const lng = value?.longitude
        return `https://maps.google.com/?q=${lat},${lng}`
    }

    return (
        <div className="mapStyling">
            <h3>{displayName}</h3>

            {displayMap()}

            <div className="coordinateLabel">
                <a href={getMapLink()} target="_blank">
                    {translations.components.map.latitude}: {value?.latitude.toFixed(4)}{' '}
                    {translations.components.map.longitude}: {value?.longitude.toFixed(4)}
                </a>
            </div>
        </div>
    )
}

export default MapField
