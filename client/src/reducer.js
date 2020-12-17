const initState = {
    signUpIsOpen: false,
    signInIsOpen: false,
    isAuthorized: false,
    name: null,
    email: null,
    password: null,
    token: null,
    userId: null,
    users: null,
    selectedUsers: [],
    allSelected: false
}
export const reducer = (state = initState, action) => {
    switch (action.type) {
        case 'signUpClick': {
            const newState = {...state, signUpIsOpen: !state.signUpIsOpen}
            return newState
        }
        case 'signInClick': {
            const newState = {...state, signInIsOpen: !state.signInIsOpen}
            return newState
        }
        case 'authChanged': {
            const newState = {...state, name: action.payload.name, email: action.payload.email, password: action.payload.password}
            return newState
        }
        case 'authPassed': {
            const newState = {...initState, token: action.payload.token,  userId: action.payload.userId, isAuthorized: true}
            return newState
        }
        case 'logOut' : {
            return initState
        }
        case 'setUsers' : {
            const newState = {...state, users: action.payload}
            return newState
        }
        case 'selectUser' : {
            const newState = {...state, selectedUsers: action.payload}
            return newState
        }
        default: {
            return state
        }
    }
}