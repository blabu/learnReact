import React, { useState, useContext } from 'react'
import { Map as LeafletMap, Marker, TileLayer } from 'react-leaflet'
import Leaflet from 'leaflet'
import {LoaderRing as Loader} from '../Loader/Loader'
import Alert from '../Alert' 
import 'leaflet/dist/leaflet.css'
import '../../public/locBlue.png'
import '../../public/shadow.png'
import {UserContext} from "../context/UserState"
import { SERVER_ADDR } from '../utilities/repository';
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
    const [error, showError] = useState('');
    const context = useContext(UserContext);
    const pos = {...center, zoom:13};
    const mapURL = SERVER_ADDR+'/api/v1/maps/{z}/{x}/{y}?key={accessToken}';
    const markerPull = markers.map( pos => <Marker key={i} 
                                                   position={[pos.lat, pos.lng]} 
                                                   icon={icon} 
                                                   draggable={true}>
                                            </Marker>);
    const loadedMap = [
            <Loader hidden={loading} key="loader"/>,
            <div className={error.length>0?"d-block":"d-none"} key="error"><Alert head={error}/></div>,
            <LeafletMap whenReady={()=>setLoading(true)}
                        key="map"
                        center={[pos.lat, pos.lng]} 
                        zoom={pos.zoom} 
                        style={{width:"100%", height:"50rem"}}>
                    <TileLayer
                        url={mapURL}
                        accessToken={context.state.key}
                        ontileerror={(e)=>{
                            showError("Tile layer load error")
                        }}
                    />
                    {markerPull}
            </LeafletMap>
    ]
    
    return <div>{loadedMap}</div>;
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