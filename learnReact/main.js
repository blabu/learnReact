"use strict";

// Асоциативный массив который хранит все отображения
// Реальные елементы дом дерева
// В качестве ключа _uniqIdentifier
const ViewMap = new Map();
//Хранилище уникальных виртуальных компонентов
let VirtualDom = new Map();

// Отрисовка реального dom дерева
class BuildTree {
    constructor(rootComponent) {
        this.root = rootComponent;
    }

    // @param parent - docuent.node
    // @param children - array of VirtualComponents (children this parent node)
    _addChildren(parent, children) {
        if(children instanceof Array) {
            children.forEach(childElement => {
                if(typeof childElement === 'string' || typeof childElement === 'number') {
                    parent.appendChild(document.createTextNode(childElement));
                    return;
                }
                parent.appendChild(ViewMap.get(childElement.props._uniqIdentifier));
            });
        }
    }

    _appendProperty(_element, key, value) {
        switch(key) {
            case 'className':
                const values = value.split(' ');  
                _element.classList.remove(...values)
                _element.classList.add(...values);
                break;
            case 'id':
                _element.id = value.trim();
                break;
            case 'callbacks': 
            // argument must be an object:
            // with key - event name like click or mouseover
            // and value - function handler for this event
                Object.keys(value).forEach((eventName)=>{
                    _element.addEventListener(eventName.trim(), value[eventName]);
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
                    _element.setAttribute("style",allStyles.join(";"))
                    break;
            default:
                _element.setAttribute(key,value);
        }
    }

    build() {
        this.root.forEach(component => {
            if(typeof component === 'string' || typeof component === 'number') {
                return;
            }
            if(!component.isChangeChildList && 
               !component.isChangeProp &&
                ViewMap.has(component.props._uniqIdentifier)) {
                return;
            }
            component.isChangeChildList = false;
            component.isChangeProp = false
            if(component._parent != null) ViewMap.delete(component._parent.props._uniqIdentifier);
            const element = document.createElement(component.type);
            console.debug(`Create dom element ${component.type} and key ${component.props.key}`);
            Object.keys(component.props).forEach(attrName => {
                this._appendProperty(element, attrName, component.props[attrName]);
            });
            this._addChildren(element, component._children);
            ViewMap.set(component.props._uniqIdentifier, element);
        });
        ViewMap.get(this.root.props._uniqIdentifier).normalize();
        return ViewMap.get(this.root.props._uniqIdentifier);
    }
}

class ComponentInterface {
    forEach(callback) {
        throw "Not implemented yet";
    }

    addChildren(...children) {
        throw "Not implemented yet";
    }
}

// Виртуальное дерево компонентов 
// ======================================
// Базовый компонент. 
// Определяет функционал отрисовки,
// назначает уникальный идентификатор всем компонентам.
// Создает и хранит отображение компонента с помощью viewInterface
class VirtualComponent extends ComponentInterface {
    type = "";  // Тип компонента
    props = {}; // Свойства компонента
    _parent = null; // Parent virtual component. If null this is root
    _children = []; // Children is an array of virtual components
    isChangeProp = true;
    isChangeChildList = true;
    constructor(    type,        // Тип компонента
                    props,       // Атрибуты этого компонента
                    children     // Массив детей этого компонента 
    ){
        super();
        this.type = type;
        this.props = props || {};
        if(typeof props !== 'object') {
            console.error("Invalid props type. It must be an object");
            this.props = {};
        }
        //_uniqIdentifier - is a props that bind real dom elemets and virualComponent
        this.props._uniqIdentifier = Math.floor(Math.random()*0xFFFFFFFFFFFFF);
        children instanceof Array?this.addChildren(...children):this.addChildren(children);
    }

    // перебор всего дерева виртуалльных елементов начиная с this
    forEach(callback) {
        this._children.forEach(child => {
            if(child instanceof VirtualComponent) {
                child.forEach(callback);
            } else {
                callback(child);
            }
        });
        callback(this);
    }

    addChildren(...children) {
        children.forEach(e => {
            if(typeof e === 'string' || typeof e === 'number') {
                this._children.push(e);
                return
            }
            if(e === null) return
            e._parent = this;
            this._children.push(e);
        });
    }

    compareChildList(originChildList) {
        if(this._children.length != origin._children.length) {
            return true;
        }
        let isChanged = false;
        this._children.forEach((child,idx) => {
            if(child instanceof VirtualComponent) {
                isChanged = child.compareChildList(originChildList[idx]);
            } else if(child !== originChildList[idx]) {
                isChanged = true;
            }
        })
        return isChanged;
    }

    compareProps(originProps) {
        let isChanged = false;
        Object.keys(this.props).forEach(prop=>{
            if(this.props[prop] !== originProps[prop]) {
                isChanged = true;
            }
        });
        return isChanged;
    }

    // И вызывать рекурсивно update у всех детей компонента
    // В случае если свойства компонента изменились пересоздаем его, добавляя всех детей вызвав у них update
    // upadte возвращает сам компонент (тот же или модифицированный)
    update() {
        origin = VirtualDom.get(this.props._uniqIdentifier);
        this.isChangeChildList = this.compareChildList(origin._children);
        this.isChangeProp = this.compareProps(origin.props);
        console.log(`is changed props ${this.isChangeProp}, is changed child list ${this.isChangeChildList}`);
        VirtualDom.set(this.props._uniqIdentifier, Object.assign({}, this));
        new BuildTree(this._parent).build();
    }
    // Сохраняем наш виртуальный компонент в виртуальное дом дерево
    render() {
        this.forEach((e)=> {
            if (e instanceof VirtualComponent &&
                !VirtualDom.has(e.props._uniqIdentifier)) {
                VirtualDom.set(e.props._uniqIdentifier, Object.assign({}, e));
            }
        });
        return this;
    }
}

function Render(container, element) {
    console.log(element);
    const dom = new BuildTree(element.render());
    container.appendChild(dom.build(element.props._uniqIdentifier));
}

function CreateVirtualComponent (
    type,
    props = {}, // Атрибуты этого компонента
    children = []     // Массив детей этого компонента
) {
    console.debug("Create virtual component ", type, ((props && props.key)?` and key ${props.key}.`:"."));
    return new VirtualComponent(type,props,children);
}

function CopyVirtualComponent(origin) {
    if(origin instanceof VirtualComponent) {
        let childrenList = [];
        if(origin._children instanceof Array) {
            childrenList = origin._children.map(child => {
                if(child instanceof VirtualComponent) return CopyVirtualComponent(child);
                if(typeof child === 'object') return Object.assign({}, child);
                return child;
            });
        }
        console.log(`Copy component ${origin.props.key}`)
        return new VirtualComponent(origin.type, Object.assign({},origin.props), childrenList);
    } else {
        console.error("Origin is not a virtual component instance");
        return null;
    }
}