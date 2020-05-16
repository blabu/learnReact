import React, { useState, useContext } from 'react'
import { Map as LeafletMap, Marker, TileLayer } from 'react-leaflet'
import {LoaderRing as Loader} from '../Loader/Loader'
import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../../public/locBlue.png'
import '../../public/shadow.png'
import {UserContext} from "../context/UserState"
import { SERVER_ADDR } from '../repository';
import PropTypes from 'prop-types'

function Map({center, markers=[]}) {
    const icon = new Leaflet.Icon({
        iconUrl: 'locBlue.png',
        iconSize:[25,41],
        iconAnchor: [7, 25],
        shadowUrl: "shadow.png",
        shadowSize: [40,80],
        shadowAnchor: [7, 60],
    })
    const [loading, setLoading] = useState(false);
    const context = useContext(UserContext);
    const pos = {...center, zoom:13};
    const mapURL = SERVER_ADDR+'/api/v1/maps/{z}/{x}/{y}?key={accessToken}';
    const markerPull = markers.map( pos => <Marker key={i} position={[pos.lat, pos.lng]} icon={icon} draggable={true}></Marker>);
    const loadedMap = (
        <div>
            <Loader hidden={loading}/>
            <LeafletMap whenReady={()=>setLoading(true)} center={[pos.lat, pos.lng]} zoom={pos.zoom} style={{width:"100%", height:"50rem"}}>
                    <TileLayer
                        url={mapURL}
                        accessToken={context.state.key}
                    />
                    {markerPull}
            </LeafletMap>
        </div>
    );
    return loadedMap;
}

Map.propTypes = {
    center: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }),
    markers: PropTypes.arrayOf(PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }))
}

export default Map;