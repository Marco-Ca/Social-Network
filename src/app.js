import React from 'react';
import axios from './axios';
import Logo from './logo';
import Profile from './profile';
import Uploader from './uploader';
import {BrowserRouter, Route} from 'react-router-dom';
import OtherPersonProfile from './opp';
import Friends from './friends';
import Online from './online';
import Chat from './chat';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
    }
    componentDidMount() {
        axios.get('/user').then(({data}) => {
            this.setState({
                first: data.first,
                last: data.last,
                profilePic: data.image,
                id: data.id,
                bio: data.bio
            });
        });
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }
    setImage(imgUrl) {
        this.setState({
            profilePic: imgUrl,
            uploaderIsVisible: false
        });
    }
    inputFile(e) {
        this.file = e.target.files[0];
    }
    upload(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", this.file);
        axios.post("/upload", formData).then(({ data }) => {
            this.props.setImage(data);
        });
    }
    setBio(newBio) {
        this.setState({
            bio: newBio
        });
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <BrowserRouter>
                <div id="app">
                    <div id="nav">
                        <Logo />
                    </div>
                    <div id="profileImg">
                        <img src={this.state.profilePic || "/images/default.png" } onClick={this.showUploader}/>
                    </div>
                    {this.state.uploaderIsVisible && <Uploader setImage={this.setImage}/>}
                    <div>
                        <Route path="/" exact
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    profilePic={this.state.profilePic}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    showUploader={this.showUploader}
                                />
                            )}
                        />
                    </div>
                    <Route path="/users/:id" exact component={OtherPersonProfile} />
                    <Route path="/friends" exact component={Friends} />
                    <Route path="/online" exact component={Online} />
                    <Route path="/chat" exact component={Chat} />

                </div>
            </BrowserRouter>
        );
    }
}

export default App;
