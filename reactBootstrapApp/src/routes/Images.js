import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import {LoaderRing as Loader} from '../Loader/Loader'
import '../index.css'
import {LoadImage} from '../utilities/repository'

function Image({className}) {
    const [image, setImage] = React.useState('');
    if(!image.length) {
        const id = Math.floor(Math.random()*0xFFFFFFFF);
        LoadImage(`https://picsum.photos/600?random=${id}`)
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
                className="col-xl-2 col-lg-4 col-md-6 col-sm-12 pt-2"  // An example of responsive 
                key={i}/>);
    }
    return (<div>{images}</div>);
}