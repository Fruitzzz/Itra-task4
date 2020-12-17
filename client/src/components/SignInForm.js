import React, {useEffect} from 'react'
import Modal from "react-bootstrap/cjs/Modal"
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../actions'
import InputGroup from 'react-bootstrap/cjs/InputGroup'
import FormControl from 'react-bootstrap/cjs/FormControl'
import {useHttp} from "../hooks/http.hook"
import {useMessage} from "../hooks/message.hook"

const SignInForm = ({signInIsOpen, signInClick, authChanged, name, password, authPassed}) => {
    const message = useMessage()
    const {error, clearError, request, loading} = useHttp()
    useEffect( () => {
        message(error)
        clearError()
    }, [error, message, clearError])
    const signInHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {name, password})
            const storageName = 'userData'
            authPassed({token: data.token, userId: data.userId})
            message(data.message)
            localStorage.setItem(storageName, JSON.stringify({userId: data.userId, token: data.token, isAuthorized: true}))
        } catch (e) {}
    }
    return (
        <div>
            <Modal show={signInIsOpen} onHide={signInClick}>
                <Modal.Header>
                    <Modal.Title>Sign In</Modal.Title>
                    <button type="button" className="close" onClick={signInClick}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Name</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Enter your Name"
                            aria-label="Name"
                            id="name"
                            onChange={event => authChanged({name: event.target.value, email: null, password: password})}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="password"
                            placeholder="Enter your Password"
                            aria-label="Password"
                            data-toggle="password"
                            id="password"
                            onChange={event => authChanged({name: name, email: null, password: event.target.value})}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary"
                            onClick={signInClick}
                            disabled={loading}>
                            Close
                    </button>
                    <button className="btn btn-primary"
                            onClick={signInHandler}
                            disabled={loading}>
                        Sign In
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        signInIsOpen: state.signInIsOpen,
        name: state.name,
        password: state.password,
        isAuthorized: state.isAuthorized
    }
}
const mapDespatchToProps = (dispatch) => {
    const {signInClick} = bindActionCreators(actions, dispatch)
    const {authChanged} = bindActionCreators(actions, dispatch)
    const {authPassed} = bindActionCreators(actions, dispatch)
    return {signInClick, authChanged, authPassed};
}
export default connect(mapStateToProps, mapDespatchToProps)(SignInForm)
