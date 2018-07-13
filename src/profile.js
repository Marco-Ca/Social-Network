import React from 'react';
import axios from './axios';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editBioIsVisible: false
        };
        this.editBio = this.editBio.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        axios.get('/bio').then(({data}) => {
            this.setState({
                bio: data.bio
            });
        }).catch((error) => {
            console.log(error);
        });
    }
    editBio() {
        this.setState({
            editBioIsVisible: !this.state.editBioIsVisible
        });
    }

    onChange(e) {
        this.setState({
            bioInfo: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();
        axios.post('/bio', {
            bio: this.state.bioInfo
        }).then(({data}) => {
            if(data.success) {
                this.setState({
                    editBioIsVisible: false,
                    bio: data.bio
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div id="myProfile">
                <div id="myProfileImage">
                    <img src={this.props.profilePic || "/images/default.png"} />
                </div>
                <div className="myProfileText effect2">
                    <h1> { this.props.first } {this.props.last} </h1>
                    {!this.state.bio && <p id="edit" onClick={this.editBio}>- Add your bio -</p>}
                    {this.state.bio && <p>{this.state.bio}</p>}
                    {this.state.bio && <p id="edit" onClick={this.editBio}>- Edit your bio -</p>}
                    {this.state.editBioIsVisible && <ProfileText onSubmit={this.onSubmit} value={this.state.bioInfo} onChange={this.onChange} />}
                </div>
            </div>
        );
    }
}

function ProfileText(props) {
    return (
        <form onSubmit={props.onSubmit}>
            <textarea id="profileTextArea" rows="10" cols="55" value={props.bioInfo} onChange={props.onChange} required /><br />
            <input id="profileSubmit" type="submit" value="Save" />
        </form>
    );
}
