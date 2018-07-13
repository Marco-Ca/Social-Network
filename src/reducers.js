export default function(state = {}, action) {

    if (action.type === 'GET_FRIENDS') {
        state = Object.assign({}, state, {friends: action.friends});
    }
    if (action.type === 'ACCEPT_FRIENDS') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    return Object.assign({}, friend, {status: 2});
                } else {
                    return Object.assign({}, friend);
                }
            })
        });
    }
    if (action.type === 'TERMINATE_FRIENDS') {
        state = Object.assign({}, state, {
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    return Object.assign({}, friend, {status: 0});
                } else {
                    return Object.assign({}, friend);
                }
            })
        });
    }
    if (action.type === 'ONLINE_USERS') {
        state = Object.assign({}, state, {onlineUsers: action.users});
    }
    if (action.type === 'USER_JOINED') {
        state = Object.assign({}, state, {onlineUsers: state.onlineUsers.concat(action.userJoined)});
    }

    if (action.type == "USER_LEFT") {
        state = Object.assign({}, state, {onlineUsers: state.onlineUsers.filter(user => user.id != action.userLeft
        )});
    }

    if (action.type == "GET_CHAT_MESSAGES") {
        state = Object.assign({}, state, {chatMessages: action.messages});
    }

    if (action.type == "NEW_CHAT_MESSAGE") {
        state = Object.assign({}, state, {chatMessages: state.chatMessages.concat(action.newMessage)});
    }

    if (action.type == "USER_SEARCH") {
        let box = document.querySelector(".searchResults");
        if (action.userList == []) {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
        if (action.userList.length > 10) {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
        state = Object.assign({}, state, {
            searchResults: action.userList
        });
    }
    return state;
}
