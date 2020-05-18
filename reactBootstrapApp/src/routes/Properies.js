import React from 'react'
import {Get, STAT, ResolveAfter} from '../utilities/repository';
import {UserContext} from '../context/UserState';
import {LoaderRing as Loader} from '../Loader/Loader'
import Alert from '../Alert'

class Properies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            serverStatus: {
                version:"",
                oneConnectionTimeout:0,
                maxResponce:0,
                timeUP:"",
                nowConnected:0,
                maxConcurentConnection:0,
                allConnection:0,
                allIP:[]
            },
            error: ""
        }
        console.debug("In properties", this.context)
    }

    componentWillMount() {
        console.debug("In will mount properties", this.context)
    }

    componentDidMount() {
        console.debug("In did mount properties", this.context)
        this.updateServerStat();
    }

    updateServerStat() {
        this.setState({...this.state,isLoading:true});
        ResolveAfter(1000).then(()=>
        Get(STAT, {key:"key", value: this.context.state.key}))
        .then(resp => {
                this.setState({...this.state, serverStatus:{...resp}});
        })
        .catch(err => {
            this.setState({...this.state, error: `${err.name}:${err.message}`});
            console.warn(err)
        })
        .finally(()=> this.setState({...this.state, isLoading: false}));
    }

    render() {
        console.debug("In render properties ", this.context);
        return this.state.isLoading ? <Loader/> :
            (<div>
                <div className={this.state.error.length>0?"d-block":"d-none"} key="error">
                    <Alert head={this.state.error}/>
                </div>
                <div className={this.state.error.length>0?"d-none":"d-block"}>
                    {JSON.stringify(this.state.serverStatus)}
                </div>
            </div>);
    }
}

Properies.contextType = UserContext;

export default Properies;