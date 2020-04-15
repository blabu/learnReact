//module
import {CreateVirtualComponent, Render} from './main.js'

window.onload = ()=> {
    const blockBlue = CreateVirtualComponent(
        'div',
        {
            className: "block blue",
        },
        ["Blue block"]
    );
    const blockRed = CreateVirtualComponent(
        'div',
        {
            className: "block red",
        },
        ["Red block"]
    );
    const blockGreen = CreateVirtualComponent(
        'div',
        {
            className: "block green",
        },
        ["Green block"]
    );
    const container = CreateVirtualComponent('div',{className: "container"}, 
    [ 
        blockBlue, 
        blockRed, 
        blockGreen,
        blockBlue, 
        blockRed,
    ]);

    Render(container, document.getElementById("root"));
};