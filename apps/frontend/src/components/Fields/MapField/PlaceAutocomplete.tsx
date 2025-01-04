import './MapField.scss'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { Nullish } from '@3dp4me/types';
import {
    useMapsLibrary,
  } from '@vis.gl/react-google-maps';

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: Nullish<google.maps.places.PlaceResult>) => void;
}

export const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState<Nullish<google.maps.places.Autocomplete>>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');
  
    useEffect(() => {
      if (!places || !inputRef.current) return;
  
      const options = {
        fields: ['geometry', 'name', 'formatted_address']
      };
  
      setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);
  
    useEffect(() => {
      if (!placeAutocomplete) return;
  
      placeAutocomplete.addListener('place_changed', () => {
        onPlaceSelect(placeAutocomplete.getPlace());
      });
    }, [onPlaceSelect, placeAutocomplete]);
  
    return (
      <div className="autocomplete-container">
        <input ref={inputRef} />
      </div>
    );
  };