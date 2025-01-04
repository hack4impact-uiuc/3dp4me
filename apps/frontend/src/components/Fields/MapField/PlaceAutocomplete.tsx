/* global google */
import './MapField.scss'

import { Nullish } from '@3dp4me/types'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: Nullish<google.maps.places.PlaceResult>) => void
}

const AutocompleteContainer = styled.div`
    width: 300px;

    input {
        width: 100%;
        height: 40px;
        padding: 0 12px;
        font-size: 18px;
        box-sizing: border-box;
    }
`

export const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
    const [placeAutocomplete, setPlaceAutocomplete] =
        useState<Nullish<google.maps.places.Autocomplete>>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const places = useMapsLibrary('places')

    useEffect(() => {
        if (!places || !inputRef.current) return

        const options = {
            fields: ['geometry', 'name', 'formatted_address'],
        }

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
    }, [places])

    useEffect(() => {
        if (!placeAutocomplete) return

        placeAutocomplete.addListener('place_changed', () => {
            onPlaceSelect(placeAutocomplete.getPlace())
        })
    }, [onPlaceSelect, placeAutocomplete])

    return (
        <AutocompleteContainer>
            <input ref={inputRef} />
        </AutocompleteContainer>
    )
}
