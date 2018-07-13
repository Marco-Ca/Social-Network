import * as io from 'socket.io-client';
import { onlineUsers, userJoined, userLeft, insertChatMessage, getChatMessages } from './action';

let socket;

export function getSocket(store) {
    if(!socket) {
        socket = io.connect();

        socket.on('onlineUsers', users => {
            store.dispatch(onlineUsers(users));
        });
        socket.on('userJoined', user => {
            store.dispatch(userJoined(user));
        });
        socket.on('userLeft', id => {
            store.dispatch(userLeft(id));
        });
        socket.on("chatMessage", newMessage => {
            store.dispatch(insertChatMessage(newMessage));
        });
        socket.on("chatMessages", messages => {
            store.dispatch(getChatMessages(messages));
        });
    }
    return socket;
}

// export function emit(eventName, data) {
//     socket.emit(eventName, data)
// }
