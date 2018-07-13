import React from 'react';
import axios from './axios';

class FriendMeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Make Friend Request",
            status: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonValue = this.buttonValue.bind(this);
    }
    buttonValue(){
        const {sender_id, status} = this.props;
        let text;
        if (status == 0) {
            text = "Send Friend Request";
        } else if (status == 1) {
            text = "Cancel Friend Request";
            if (sender_id == this.props.match.params.id) {
                text = "Accept Friend Request";
            }
        } else if (status == 2) {
            text = "Unfriend";
        } else if (status == 3) {
            text = "Send Friend Request";
        }
        return text;
    }

    handleSubmit(e){
        e.preventDefault();
        const {status, updateStatus, sender_id} = this.props;
        if (status == 0 || status == 4 || status == 5) {
            axios.post(`/sendfriendrequest/${this.props.match.params.id}`).then(resp => {
                updateStatus(resp.data.status);
            });
        }
        else if (status == 1) {
            if (sender_id == this.props.match.params.id) {
                axios.post(`/acceptfriendrequest/${this.props.match.params.id}`, {status}).then(resp => {
                    updateStatus(resp.data.status);
                });
            } else {
                axios.post(`/cancelfriendrequest/${this.props.match.params.id}`).then(resp => {
                    updateStatus(resp.data.status);
                });
            }
        }
        else if (status == 2) {
            axios.post(`/removefriend/${this.props.match.params.id}`).then(resp => {
                updateStatus(resp.data.status);
            });
        }
    }
    render() {

        return (
            <div>
                <button className="friendBtn" onClick={this.handleSubmit}>{this.buttonValue()}</button>
            </div>
        );
    }
}

export default FriendMeButton;
