import React, {useCallback, useEffect} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../actions'
const Header = ({signUpClick, signInClick, logOut, isAuthorized, authPassed}) => {
    const storageName = 'userData'
    const storage = JSON.parse(localStorage.getItem(storageName))
    const signIn = useCallback(async () => {
        if(storage) {
            authPassed(storage)
        }
    }, [storage, authPassed])
    useEffect(() => {
        signIn()
    }, [signIn])
        return (
            <header className="header d-flex justify-content-between">
                <h1 className="cursor-none">Applicaton</h1>
                <ul className="pagination list-group-flush">
                    <li className="list-group-item" hidden={isAuthorized}>
                        <button className="btn btn-primary" onClick={signUpClick}>Sign up</button>
                    </li>
                    <li className="list-group-item" hidden={isAuthorized}>
                        <button className="btn btn-primary" onClick={signInClick}>Sign in</button>
                    </li>
                    <li className="list-group-item" hidden={!isAuthorized}>
                        <button className="btn btn-primary" onClick={() => {
                            logOut()
                            localStorage.removeItem(storageName)}}>
                            LogOut
                        </button>
                    </li>
                </ul>
            </header>
        )
}

const mapStateToProps = (state) => {
    return {
        signUpIsOpen: state.signUpIsOpen,
        signInIsOpen: state.signInIsOpen,
        isAuthorized: state.isAuthorized
    }
}
const mapDespatchToProps = (dispatch) => {
    const {signInClick} = bindActionCreators(actions, dispatch)
    const {signUpClick} = bindActionCreators(actions, dispatch)
    const {logOut} = bindActionCreators(actions, dispatch)
    const {authPassed} = bindActionCreators(actions, dispatch)
    return {signInClick, signUpClick, logOut, authPassed}
}
export default connect(mapStateToProps, mapDespatchToProps)(Header);
