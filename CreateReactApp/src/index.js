import React from 'react'
import ReactDOM from 'react-dom'
import Widget from './Widget'


class App extends React.Component {
    render() {
        const allElements = []
        for(let i = 0; i<10; i++) {
            allElements.push(React.createElement(Widget, {n: i+1, key:i}, null))
        }
        return React.createElement("div",null, allElements);
    }
}

window.onload = ()=> {
    ReactDOM.render(React.createElement(App,null,null), document.getElementById('app'));
}