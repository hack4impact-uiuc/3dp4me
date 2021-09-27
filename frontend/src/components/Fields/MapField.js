import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Search from 'react-leaflet-search';
import PropTypes from 'prop-types';

import { COUNTRY } from '../../utils/constants';
// <MapField position={[41.076602, 30.052495]} /> put in a container
// Make state a prop
// Make marker movable either by searching or dragging (and not appear if no position is passed in)
const MapField = ({ position }) => {
    return (
        <Map
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            height="200px"
            width="200px"
        >
            <TileLayer
                noWrap
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
                <Popup> Popup! </Popup>
            </Marker>

            <Search
                position="topleft"
                inputPlaceholder="Custom placeholder"
                // search={this.state.search}
                showMarker={false}
                zoom={7}
                closeResultsOnClick
                openSearchOnLoad={false}
                providerOptions={{
                    region: { COUNTRY },
                }}

                // default provider OpenStreetMap
                // provider="BingMap"
                // providerKey="AhkdlcKxeOnNCJ1wRIPmrOXLxtEHDvuWUZhiT4GYfWgfxLthOYXs5lUMqWjQmc27"
            >
                {(info) => <Marker position={info?.latLng} />}
            </Search>
        </Map>
    );
};

MapField.propTypes = {
    position: PropTypes.array,
};

export default MapField;
