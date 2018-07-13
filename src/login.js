import React, {Component} from 'react';
import axios from './axios';
import {Link} from 'react-router-dom';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
                        error: true
                    });
                }});
    }
    render() {
        return (
            <div>
                <Link to="/">Click here to Register!</Link>
                <h1>Login</h1>
                {this.state.error && <div className="err">Oooops, something went wrong</div>}
                <form onSubmit={this.onSubmit}>
                    <input onChange={this.onChange} name="email" placeholder="email" type="email" />
                    <input onChange={this.onChange} name="password" placeholder="password" type="password" />
                    <button>Login</button>
                </form>
            </div>
        );
    }}


export default Login;
