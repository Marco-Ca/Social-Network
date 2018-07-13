import React from 'react';
import Register from './register';
import { HashRouter, Route } from 'react-router-dom';
import Login from './login';


export default function Welcome() {
    return (
        <div id="welcome">
            <div id="nav">
                <h1>Diary</h1>
            </div>
            <img id="homebook" src="/images/notebook1.png" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
