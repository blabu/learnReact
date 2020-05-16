import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import {BrowserRouter as Router, Switch, Link, Route}  from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '../public/iconLight.png'

function NavItem({name, url, onClick, className="", isActive=false, icon=null}) {
    const style = {
        display: "flex",
        alignItems: "center"
    }
    return (
        <div className="nav-item" style={style}>
            <div className="d-sm-block d-md-none d-lg-block">
                {icon}
            </div>
            <Link className={`nav-link ${isActive?"active":""} ${className}`}
                  onClick={onClick} to={url}>
                    {name}
            </Link>
        </div>
        );
}

// props.children is array of object {url, name, component}
function Menu({children}) {
    const [open, setOpen] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState(0);
    const navMenuItems = children.map((el,idx)=> {
        return <NavItem {...el}
                isActive={activeItem == idx} 
                key={idx} 
                onClick={()=>{setActiveItem(idx)}}/>
    });
    return(
        <Router>
        <nav className="navbar navbar-expand-md nav-pills nav-fill bg-white">
            <img  className="navbar-brand" style={{width:"3rem"}} src={Logo}/>
            <button className="navbar-toggler"
                    onClick = {()=>{
                        if(!open) document.getElementById('navBarContent').classList.add("show");
                        else document.getElementById('navBarContent').classList.remove("show")
                        setOpen(!open);
                    }}
            >
                {
                    open ? <span style={{fontSize:"2rem"}}>&times;</span>:
                           <span style={{fontSize:"2rem"}}>&#9776;</span>
                }
            </button>
            <div className="collapse navbar-collapse" id="navBarContent">
                {navMenuItems}
            </div>
        </nav>
        <Switch>
            {children.map((child,idx) => {
                return (
                <Route path={child.url} key={idx}>
                    {child.component}
                </Route>);
            })}
        </Switch>
    </Router>
    );
}

Menu.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.shape(
            {
                url: PropTypes.string.isRequired,
                name: PropTypes.string,
                icon: PropTypes.element,
                component: PropTypes.element.isRequired,
            }
        )
    ).isRequired
};

export default Menu;