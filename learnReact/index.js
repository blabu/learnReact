//module
// import {CreateVirtualComponent, Render} from './main.js'

//Можно создавать свои кастомные компоненты
class component extends VirtualComponent {
    constructor(...children) {
        super("div", {
            className: "wrap",
        }, children);
    }
}

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

    const div = CreateVirtualComponent('div',{className: "container"}, [
        CreateVirtualComponent('div', {
            className: "wrap",
            callbacks: {
                click: ()=>{
                    div.props.children.push(blockRed);
                    div.update();
                }
            },
        }, [
            blockGreen,
            blockRed,
            blockBlue,
        ]),
    ]);

    const s = new component("Hello world", blockGreen);

    Render(new component(
        CreateVirtualComponent('div',null,[container1,container1,div]),
        s,
        new component(null)), document.getElementById("root"),
    );
};
