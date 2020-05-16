import React from 'react'
import {LoaderRing as Loader} from './Loader/Loader'
import { ResolveAfter, Get, CHECK_KEY } from './repository'
import {UserContext} from './context/UserState'
import Logo from '../public/iconLight.png'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import './Alert'
import Alert from './Alert';

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isLoad: false,
            isRemember: false
        };
        this.handleOnSubmit = this.handleOnSubmitProd;
    }

    componentDidMount() {
        console.debug("Current context is ", this.context);
        if (localStorage.getItem("isRemember")) {
            this.setKey(localStorage.getItem("key"), localStorage.getItem("name"));
        }
    }

    handleOnSubmitTest() {
        this.setState({...this.state, isLoad: true});
        ResolveAfter(1000, {key: "key", name: this.insertedKey})
        .then((data)=>{
            console.debug("Receive data ", data);
            if(data.name.length < 7) throw "Key is to short";
            this.setState({isLoad: false, isError: false})
            this.setKey(data.key, data.name);
        })
        .catch(err => {
            console.warn(err);
            this.setState({isLoad: false, isError: true})
            console.debug(this.state);
        });
    }

    handleOnSubmitProd() {
        this.setState({ ...this.state, isLoad: true });
        ResolveAfter(2000)
            .then(() => Get(CHECK_KEY,
                { key: "key", value: this.insertedKey },
                { key: "path", value: "/" }))
            .then(answer => {
                if (answer.error) {
                    console.log(answer.error)
                    throw answer.error;
                }
                this.setState({ ...this.state, isLoad: false });
                this.setKey(answer.key, answer.name);
                if (this.state.isRemember) {
                    localStorage.setItem("name", answer.name);
                    localStorage.setItem("key", answer.key);
                    localStorage.setItem("isRemember", true);
                } else {
                    localStorage.setItem("name", "");
                    localStorage.setItem("key", "");
                    localStorage.setItem("isRemember", false);
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ isError: true, isLoad: false });
            })
    }

    keyChanges(event) {
        this.insertedKey = event.target.value;
        if(this.state.isError) this.setState({ ...this.state, isError: false });
        console.debug("Inserted key is ", this.insertedKey);
    }

    handleChange(event) {
        console.debug("Remember me is ", event.target.checked);
        this.setState({...this.state, isRemember : event.target.checked});
    }

    setKey(newKey, name) {
        this.context.updateState(true, newKey, name);
    }

    render() {
        if (!this.state.isLoad) {
            return (
                <div>
                {!this.state.isError || <Alert head="Incorrect key value" body="Please try again"/>}
                <div className="authForm">
                <form onSubmit={(event) => { event.preventDefault(); this.handleOnSubmit(event) }}>
                    <img id="logoAuth" src={Logo} alt=""/>
                    <div className="form-group">
                        <label>{this.state.isError ? "Error" : "Key"}</label>
                        <input type="text" className="form-control"
                                onChange={this.keyChanges.bind(this)}
                                placeholder="Input key here"/>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input"
                                type="checkbox" 
                                onChange={this.handleChange.bind(this)}/>
                        <label className="form-check-label">
                            Remember me
                        </label>
                    </div>
                    <div>
                    <button type="button" className="btn btn-primary"
                        onClick={this.handleOnSubmit.bind(this)}>OK
                    </button>
                    </div>
                </form>
                </div>
                </div>
            );
        }
        return (<div className="loader-position"><Loader/></div>)
    }
}

Auth.contextType = UserContext

export default Auth