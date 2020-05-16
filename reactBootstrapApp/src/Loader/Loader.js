import React from 'react'
import './Loader.css'

function LoaderDoubleCircle({color='darkgrey', hidden=false}) {
    if(hidden) return null;
    return (<div className="loader-color lds-dual-ring" style={{'--baseColor':color}}></div>);
}

function LoderPoints({color='darkgrey', hidden=false}) {
    if(hidden) return null;
    return (<div className="loader-color lds-ellipsis" style={{'--baseColor':color}}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </div>);
}

function LoaderBar({color='darkgrey', hidden=false}) {
    if(hidden) return null;
    return (<div className="loader-color lds-facebook" style={{'--baseColor':color}}>
            <div></div>
            <div></div>
            <div></div>
        </div>);
}

function LoaderRing({color='darkgrey', hidden=false}) {
    if(hidden) return null;
    return (
        <div className={"loader-color lds-ring"} style={{'--baseColor':color}}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>);
}

function LoaderHourGlass({color='darkgrey', hidden=false}) {
    if(hidden) return null;
    return (<div className="loader-color lds-hourglass" style={{'--baseColor':color}}></div>);
}

function LoaderCircle({color='darkgrey', hidden=false}) {
    if(hidden) return null;
    return (
            <div className="loader-color lds-circle" style={{'--baseColor':color}}>
                <div></div>
            </div>);
}

export {
    LoaderCircle,
    LoaderDoubleCircle,
    LoderPoints,
    LoaderBar,
    LoaderRing,
    LoaderHourGlass
}