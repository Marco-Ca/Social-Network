import React from 'react';

export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            greetee: this.props.greetee
        };
        this.changeGreetee = this.changeGreetee.bind(this);
    }
    changeGreetee(greetee) {
        this.setState({ greetee });
    }
    render() {
        return (
            <div>
                <GreeteeEditor changeGreetee={this.changeGreetee}/>
                <h1>{this.state.greetee}</h1>
                <div className="funky-chicken">Hello, <Greetee name={this.state.greetee} /></div>
            </div>
        );
    }
}

function Greetee(props) {
    return <span>{props.name || 'World'}</span>;
}

function GreeteeEditor({ changeGreetee }) {
    return <input type="text" onChange={e => changeGreetee(e.target.value)}/>;
}
