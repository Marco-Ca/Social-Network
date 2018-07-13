import React from 'react';
import { connect } from 'react-redux';
import { getSocket } from "./socket";


class Chat extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
    render() {
        return (
            <div>
                <div className="diariesContainer0" ref={elem => (this.elem = elem)}>
                    {this.props.chatMessages && this.props.chatMessages.map(msg => {
                        return (
                            <div className="diariesContainer" key={msg.id}>
                                <div className="diaries">
                                    <div><strong>{msg.content}</strong></div>
                                    <div className="hide">
                                        <div><strong>Diary by: </strong>{msg.first} {msg.last}</div>
                                        <div><em>{new Date(
                                            msg.created_at
                                        ).toLocaleDateString()}&nbsp;
                                            at&nbsp;
                                        {new Date(
                                            msg.created_at
                                        ).toLocaleTimeString()}</em></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="textAreaDiary">
                    <textarea className="textArea" rows="5" cols="30" name="textarea"
                        onChange={e => (this[e.target.name] = e.target.value)}/><br/>
                    <img id="addButton" src={"/images/button.png" } onClick={() => {getSocket().emit("chatMessage",
                        this.textarea);
                        function clear() {
                          console.log(document.getElementsByClassName("textArea"));
                        }
                        clear();




                    }
                    } />
                </div>
            </div>
        );
    }}

const mapStateToProps = state => {
    return {
        chatMessages: state.chatMessages
    };
};

export default connect(mapStateToProps)(Chat);
