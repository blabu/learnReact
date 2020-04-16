"use strict";

class ViewInterface {
    get Component() {
        if(this._element === null) {
            throw "Component did not created";
        }
        return this._element;
    }
}

class DOMcomponentInstance extends ViewInterface {
    constructor ( virtualComponent ) {
        super(virtualComponent);
        this._createRootElement(virtualComponent.type);
        console.debug("Create instance component ", this._type);
        Object.keys(virtualComponent.props).filter(attrName=>attrName!="children").forEach(attrName => {
            this._appendProperty(attrName, virtualComponent.props[attrName]);
        });
        this._appendChildren(virtualComponent.props.children);
    }

    _createRootElement(componentType) {
        switch(typeof componentType) {
            case 'string':
                this._type = componentType.trim();
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
                        this._element.appendChild(element.render());
                    });
                } catch(e) {
                    console.warn(e);
                }
                break;
            default: throw `Incorrect type ${typeof children} of children ${children} for component ${this._type}`;
        }
    }

    _appendProperty(key, value) {
        switch(key) {
            case 'className':
                const values = value.split(' ');  
                this._element.classList.remove(...values)
                this._element.classList.add(...values);
                break;
            case 'id':
                this._element.id = value.trim();
                break;
            case 'callbacks': 
            // argument must be an object:
            // with key - event name like click or mouseover
            // and value - function handler for this event
                Object.keys(value).forEach((eventName)=>{
                    this._element.addEventListener(eventName.trim(), value[eventName]);
                });
                break;
                case 'styles': 
                    //Argument must be an object:
                    // with keys: styleParameter in camelCase
                    // value - string style value
                    const reg = new RegExp(/[A-Z]/,'g');
                    const allStyles = [];
                    Object.keys(value).forEach((style)=> {
                        const styleName = style.replace(reg, str=>"-"+str.toLowerCase())
                        allStyles.push(`${styleName}:${value[style]}`)
                    })
                    this._element.setAttribute("style",allStyles.join(";"))
                    break;
            default:
                this._element.setAttribute(key,value);
        }
    }
}

let componentCache = new Map()

class VirtualComponent {
    constructor(    type,         
                    props,       // Атрибуты этого компонента
                    children     // Массив детей этого компонента
    ){
        this.type = type;
        this.props = props || {};
        this.props.children = children;
        this.viewInterface = DOMcomponentInstance;
    }

    render() {
        return new this.viewInterface(this).Component; // Create new dom element
    }
}

//export 
function Render(element, container) {
    container.appendChild(element.render());
}

//export 
function CreateVirtualComponent (
    type,
    props = {}, // Атрибуты этого компонента
    children = []     // Массив детей этого компонента
) {
    console.debug("Create virtual component ", type, ((props && props.key)?` and key ${props.key}.`:"."));
    if (props && props.key) {
        if(componentCache.has(props.key)) {
            console.debug(`Component ${type} with key ${props.key} finded in cache`);
            return componentCache.get(props.key);
        }
        const e = new VirtualComponent(type,props,children);
        componentCache.set(props.key, e);
        return e;
    }
    const e = new VirtualComponent(type,props,children);
    return e;
}
