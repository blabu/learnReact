import React from 'react'
import './index.css'

export default function Widget(props) {
    const maxPosX = 800;
    const maxPosY = 1600;
    const [position, setPosition] = React.useState({
        x:props.x | Math.ceil(Math.random()*maxPosX), 
        y:props.y | Math.ceil(Math.random()*maxPosY), 
        dirX: true, 
        dirY: true,
    });
    setTimeout(()=>{
        const deltaX = Math.ceil(Math.random()*5);
        const deltaY = Math.ceil(Math.random()*5);
        let newPosX = 0, newPosY = 0;
        let directX = position.dirX;
        let directY = position.dirY;
        newPosX = position.dirX ? position.x+deltaX : position.x-deltaX;
        newPosY = position.dirY? position.y+deltaY: position.y-deltaY;
        if (newPosX > maxPosX) {
            newPosX = maxPosX;
            directX = !position.dirX;
        }
        if (newPosY > maxPosY) {
            newPosY = maxPosY;
            directY = !position.dirY;
        } 
        if(newPosX < 0){
            newPosX = 0;
            directX = !position.dirX;
        }
        if(newPosY < 0){
            newPosY = 0;
            directY = !position.dirY;
        }
        setPosition({x: newPosX, y: newPosY, dirX: directX, dirY: directY})
    }, 2);
    return (
    <div className="box" style={{top:position.x, left:position.y}}>
        <p>Блок {props.n}</p>
    </div>
    );
}