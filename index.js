//module
// import {CreateVirtualComponent, Render} from './main.js'

window.onload = ()=> {
    const blockBlue = CreateVirtualComponent(
        'div',
        {
            key: "blue",
            className: "block blue",
        },
        ["Blue block"]
    );
    const blockRed = CreateVirtualComponent(
        'div',
        {
            styles: {
                fontWeight: "bold",
                fontFamily: "Arial",
                color: "orange",
            },
            key: "red",
            className: "block red",
        },
        ["Red block"]
    );
    const blockGreen = CreateVirtualComponent(
        'div',
        {
            style:"font-style:italic",
            key:"green",
            className: "block green",
        },
        "Green block"
    );
    const container1 = CreateVirtualComponent('div',{key: "container", className: "container"}, 
    [ 
        blockBlue, 
        blockRed, 
        blockGreen,
        blockBlue, 
        blockRed,
    ]);

    const containerCopy = CreateVirtualComponent('',{key:"container"});

    const container2 = CreateVirtualComponent('div', {
        className: "container",
        callbacks: {
            click: ()=>{
                container2.props.children.push(blockRed);
                container2.update();
            }
        },
    }, [
        blockGreen,
        blockRed,
        blockBlue,
    ])

    Render(CreateVirtualComponent('div',null,[container1,containerCopy,container2,container1,container2]), document.getElementById("root"));
};