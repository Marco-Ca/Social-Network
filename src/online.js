import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

class Online extends React.Component {
    constructor(props) {
        super(props);
        this.getOnlineFriends = this.getOnlineFriends.bind(this);
    }
    getOnlineFriends() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return this.props.onlineUsers.map(onlineUser => {
            return (
                <div className="onlineContainer" key={onlineUser.id}>
                    <img className="onlineImage" src={onlineUser.image} />
                    <Link className="onlineText" to={`/users/${onlineUser.id}`}>
                        <p>{onlineUser.first} {onlineUser.last}</p>
                    </Link>
                </div>
            );
        });
    }
    render() {
        return (
            <div className="onlineFriendsContainer">
                <h1><strong> People who are <span>ONLINE</span> </strong></h1>
                <div className="onlinefriends">{this.getOnlineFriends()}</div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(mapStateToProps)(Online);
