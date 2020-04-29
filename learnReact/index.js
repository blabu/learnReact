//module
// import {CreateVirtualComponent, Render} from './main.js'

//Можно создавать свои кастомные компоненты
class component extends VirtualComponent {
    constructor(...children) {
        super("div", {
            key: "wraper",
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
            callbacks: {
                click: (e)=>{
                    console.log("Click on blue");
                    blockBlue.props = {...blockBlue.props, className: "block red"};
                    blockBlue.update();
                }
            },
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
        ["Red block\n", 10]
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
                click: (e)=>{
                    div.addChildren(CopyVirtualComponent(blockBlue));
                    console.log(div);
                    div.update();
                    console.log(e.target.getAttribute("_uniqidentifier"));
                }
            },
        }, [
            blockGreen,
            blockRed,
            blockBlue,
            blockGreen
        ]),
    ]);

    const s = new component("Hello world", blockGreen);

    //Render(document.getElementById("root"),container1);
    Render(
        document.getElementById("root"),
        new component(
            CreateVirtualComponent('div',{key: "customDiv"},[
                div,
            ]),
            CopyVirtualComponent(s))
        );
};
