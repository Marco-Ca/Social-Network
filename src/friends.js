import React from 'react';
import {connect} from 'react-redux';
import { addFriends, acceptFriends, dumpFriends } from './action';
import { Link, browserHistory } from 'react-router-dom';
import {searchUserByName} from './action';
import Search from "./searchfriends";



class Friends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.dispatch(addFriends());
    }
    handleSearchChange(e){
        this.setState({
            friendSearchInput: e.target.value
        });
    }
    handleSearchSubmit(e){
        const {friendSearchInput} = this.state;
        if(friendSearchInput){
            this.props.dispatch(searchUserByName(friendSearchInput));
            this.setState({
                friendSearchInput: ''
            });
            //render results to user
            browserHistory.push('/search');
        }
    }
    render() {
        if (!this.props.pending) {
            return null;
        }
        const pendingFriendsList = this.props.pending.map((pending, id) => (
            <div className="friendslist friendslistPending" key={id}>
                <Link className="pending" to={`/users/${pending.id}`}>
                    <p className="friendslistName">{pending.first} {pending.last} </p>
                </Link>
                <div className="friendslistPic">
                    <img className="friendsImage" src={pending.image} />
                    <button onClick={() =>{this.props.dispatch(acceptFriends(pending.id));
                    }}>Accept</button>
                </div>
            </div>
        ));
        const acceptedFriendsList = this.props.accepted.map((accepted, id) => (
            <div className="friendslist friendslistAccepted" key={id}>
                <Link className="accepted" to={`/users/${accepted.id}`}>
                    <p className="friendslistName">{accepted.first} {accepted.last}</p>
                </Link>
                <div className="friendslistPic">
                    <img className="friendsImage" src={accepted.image} />
                    <button onClick={() => {this.props.dispatch(dumpFriends(accepted.id));
                    }}>Unfriend</button>
                </div>
            </div>
        ));
        return (<div id="center">
            <h1 id="yes">Bookworms</h1>
            <div className="friends">
                <div className="friendslists">
                    {pendingFriendsList}
                </div>
                <div className="friendslists">
                    {acceptedFriendsList}
                </div>
            </div>
            <Search />

        </div>);
    }
}

const mapStateToProps = state => {
    return {
        pending: state.friends && state.friends.filter(friend => friend.status == 1),
        accepted: state.friends && state.friends.filter(friend => friend.status == 2)
    };
};


export default connect(mapStateToProps)(Friends);
