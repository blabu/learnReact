"use strict";

// Интерфейс создания виджетов (реальных компонентов) для отрисовки 
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
            // case 'function': 
            //     this._element = new componentType();
            //     this._type = element.type;
            //     break;
            // case 'object':
            //     this._element = componentType; 
            //     this._type = componentType.type;
            //     break;
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

/* 
Базовый компонент. 
Определяет функционал отрисовки,
назначает уникальный идентификатор всем компонентам.
Создает и хранит отображение компонента с помощью viewInterface
*/
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
        this.props._uniqIdentifier = Math.floor(Math.random()*100000000000);
        this.view = new this.viewInterface(this); // Create new dom element
        return this.view.Component;
    }

    // TODO необходимо держать в памяти виртуальную копию дерева компонентов
    // И вызывать рекурсивно update у всех детей компонента
    // В случае если свойства компонента изменились пересоздаем его, добавляя всех детей вызвав у них update
    // upadte возвращает сам компонент (тот же или модифицированный)
    update() { // Перерисовывает всех детей компонента
        const newElement = new this.viewInterface(this);
        if(this.view.Component.isEqualNode(newElement.Component)) {
            console.info("Nothing to change in element");
            return this;
        }
        var isUpdated = false;
        const parentNode = this.view.Component.parentElement;
        for(let i=0; i<parentNode.children.length; i++) {
            if(parentNode.children[i].getAttribute("_uniqIdentifier") == this.props._uniqIdentifier) {
                console.log(parentNode.children[i].getAttribute("_uniqIdentifier"));
                parentNode.replaceChild(newElement.Component, parentNode.children[i]);
                isUpdated=true;
            }
        }
        if(isUpdated) this.view = newElement;
        return this;
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
