
import './MapField.scss'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { MapPoint, Nullish } from '@3dp4me/types';
import {
    useMap
  } from '@vis.gl/react-google-maps';

interface MapHandlerProps {
    place: Nullish<MapPoint>;
}
  
export const MapHandler = ({ place }: MapHandlerProps) => {
    const map = useMap();
  
    useEffect(() => {
      if (!map || !place ) return;
  
      if (place) {
        // const bounds = new google.maps.LatLngBounds({ lat: place.latitude, lng: place.longitude });
        map.setCenter({ lat: place.latitude, lng: place.longitude });
      }
    }, [map, place]);
  
    return null;
  };
  