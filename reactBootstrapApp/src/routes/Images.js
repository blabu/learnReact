import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import {LoaderRing as Loader} from '../Loader/Loader'
import '../index.css'

async function LoadImage(id=-1) {
    if(id < 0) id = Math.floor(Math.random()*0xFFFFFFFF);
    return fetch(`https://picsum.photos/600?random=${id}`)
    .then(response=> response.blob())
    .then(blob => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', ()=>resolve(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    });
}

function Image({className}) {
    const [image, setImage] = React.useState('');
    if(!image.length) { 
        LoadImage()
        .then(img => {
            setImage(img);
        })
        return (<div className={className} style={{display: "inline-block"}}><Loader/></div>)
    }
    return (<img 
        className={className}
        src={image}
        alt="Img"
    />);
}

export default function Images({numbers}) {
    const images = [];
    for(let i=0; i<numbers; i++) {
            images.push(<Image 
                className="col-lg-2 col-md-4 col-sm-12 pt-2"  // An example of responsive 
                key={i}/>);
    }
    return (<div>{images}</div>);
}