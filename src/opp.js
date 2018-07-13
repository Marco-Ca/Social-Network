import React from 'react';
import axios from './axios';
import FriendMeButton from './friendmebutton';

export default class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            first: '',
            last: '',
            email: '',
            url: '',
            bio: ''
        };
        this.updateStatus=this.updateStatus.bind(this);
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`/users/${id}.json`).then(({data}) => {
            if (data.redirectToProfile) {
                return this.props.history.push('/');
            }
            this.setState({
                first: data.first,
                last: data.last,
                profilePic: data.image,
                id: data.id,
                bio: data.bio,
                recipient_id: data.recipient_id,
                sender_id: data.sender_id,
                status: data.status
            });
        }).catch(err => {
            console.log('axios get error', err);
        });
    }
    updateStatus(newStatus) {
        this.setState({
            status: newStatus
        });
    }
    render() {
        if (!this.state.id) {
            console.log("returning cause no state ID");
            return null;
        }
        return (
            <div id="myProfile">
                <div id="myProfileImage">
                    <img src={this.state.profilePic || "/images/default.png"} />
                </div>
                <div className="myProfileText effect2">
                    <h1>{this.state.first} {this.state.last}</h1>
                    <p>{this.state.bio}</p>
                    <FriendMeButton
                        recipient_id={this.state.recipient_id}
                        sender_id={this.state.sender_id}
                        status={this.state.status}
                        match={this.props.match}
                        updateStatus={this.updateStatus}
                    />
                </div>
            </div>
        );
    }
}
