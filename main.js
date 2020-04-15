"use strict"

function CreateVirtualComponent (
        type,
        props, // Атрибуты этого компонента
        children     // Массив детей этого компонента
    ) {
        console.debug("Create virtual component ", type);
        const e = {type: type, props: props || {}};
        e.props.children = children;
        return e;
}

class DOMcomponentInstance {
    constructor ( virtualComponent ) {
        this._createRootElement(virtualComponent.type);
        console.debug("Create instance component ", this._type);
        Object.keys(virtualComponent.props).filter(attrName=>attrName!="children").forEach(attrName => {
            this.AppendProperties(attrName, virtualComponent.props[attrName]);
        });
        this._appendChildren(virtualComponent.props.children);
    }

    _createRootElement(componentType) {
        switch(typeof componentType) {
            case 'string':
                this._type = componentType
                this._element = document.createElement(componentType);
                break;
            case 'function': 
                this._element = new componentType();
                this._type = element.type;
                break;
            case 'object':
                this._element = componentType; 
                this._type = componentType.type;
                break;
            default: throw "Incorrect component type. It must be a string";
        }
    }

    _appendChildren(children) {
        if(children === null) {
            console.debug("It is emty children list for component", this._type);
            return;
        }
        switch(typeof children) {
             case 'string':
                console.debug(`Append inner html ${children} into ${this.type}`);
                this._element.innerHTML += children;
                break;
            case 'object':
                try {
                    children.forEach(element => {
                        if(typeof element === 'string') {
                            console.debug(`Append inner html ${element} into ${this._type}`);
                            this._element.innerHTML += element;
                            return;
                        }
                        this._element.appendChild(new DOMcomponentInstance(element).Component);
                    });
                } catch(e) {
                    console.warn(e);
                }
                break;
            default: throw `Incorrect type ${typeof children} of children ${children} for component ${this._type}`;
        }
    }

    get Component() {
        if(this._element === null) {
            throw "Component did not created";
        }
        return this._element;
    }

    AppendProperties(key, value) {
        switch(key) {
            case 'className':
                const values = value.split(' ');  
                this._element.classList.remove(...values)
                this._element.classList.add(...values);
                break;
            case 'id':
                this._element.id = value;
                break;
            case 'callbacks':
                Object.keys(value).forEach((eventName)=>{
                    this._element.addEventListener(eventName, value[eventName]);
                });
                break;
        }
    }
}

function Render(element, container) {
    container.appendChild(new DOMcomponentInstance(element).Component);
}

//usage example
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
