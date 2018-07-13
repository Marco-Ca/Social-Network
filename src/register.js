import React from 'react';
import axios from './axios';
import {Link} from 'react-router-dom';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    handleInput(e) {
        this[e.target.name] = e.target.value;
    }
    handleSubmit() {
        const { first, last, email, password } = this;
        axios.post('/register', {
            first, last, email, password
        }).then(resp => {
            if (resp.data.success) {
                location.replace('/');
            } else {
                this.setState ({
                    error: true
                });
            }
        });
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => {
            console.log(this.state);
        });
    }
    onSubmit(e) {
        e.preventDefault();
        axios.post('/login', this.state)
            .then(resp => {
                if (resp.data.success) {
                    location.replace('/');
                } else {
                    this.setState ({
                        error1: true
                    });
                }});
    }
    render() {
        return (
            <div id="homepage">
                <div id="login">
                    <form onSubmit={this.onSubmit}>
                        <input autoComplete="off" onChange={this.onChange} name="email" placeholder="email" type="email" />
                        <input autoComplete="off" onChange={this.onChange} name="password" placeholder="password" type="password" />
                        <button>Login</button>
                    </form>
                    {this.state.error1 && <div className="err1">Oooops, something went wrong</div>}
                </div>

                <div id="register">
                    {this.state.error && <div className="err">Oooops, something went wrong</div>}
                    <h1>Not a member?</h1>
                    <div className="home-input">
                        <input autoComplete="off" type="text" placeholder="First Name" name="first" onChange={this.handleInput}/>
                        <input autoComplete="off" type="text" placeholder="Last Name" name="last" onChange={this.handleInput}/>
                        <input autoComplete="off" type="email" placeholder="E-mail Address" name="email" onChange={this.handleInput}/>
                        <input autoComplete="off" type="password" placeholder="Password" name="password" onChange={this.handleInput}/>
                        <button onClick={this.handleSubmit}> Register </button>
                    </div>
                </div>
            </div>
        );
    }
}
