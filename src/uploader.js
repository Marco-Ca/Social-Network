import React, {Component} from 'react';
import axios from './axios';



export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.upload = this.upload.bind(this);
        this.inputFile = this.inputFile.bind(this);
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
    render() {
        return (
            <div id="modal">
                <h2>Change your profile picture</h2>
                <input type="file" name="file" id="file" onChange={this.inputFile}/>
                <button onClick={this.upload}>Upload</button>
            </div>
        );
    }
}
