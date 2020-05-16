import React from 'react'
import {Get, STAT, ResolveAfter} from '../repository';
import {UserContext} from '../context/UserState';
import {LoaderRing as Loader} from '../Loader/Loader'

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
                allIP:[],
            }
        }
        console.debug("In properties", this.context)
    }

    componentWillMount() {
        console.debug("In mounted properties", this.context)
        this.updateServerStat();
    }

    componentDidMount() {
        console.debug("In mounted properties", this.context)
        this.updateServerStat();
    }

    updateServerStat() {
        this.setState({...this.state,isLoading:true});
        ResolveAfter(1000).then(()=>
        Get(STAT, {key:"key", value: this.context.state.key}))
        .then(resp => {
                this.setState({...this.state, isLoading: false, serverStatus:{...resp}});
        })
        .catch(err => console.warn(err));
    }

    render() {
        console.debug("In render properties ", this.context);
        return this.state.isLoading ? <Loader/> :
            (<div>
                {JSON.stringify(this.state.serverStatus)}
            </div>);
    }
}

Properies.contextType = UserContext;

export default Properies;