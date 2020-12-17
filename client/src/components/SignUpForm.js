import React, {useEffect} from 'react'
import Modal from "react-bootstrap/cjs/Modal"
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../actions'
import InputGroup from "react-bootstrap/cjs/InputGroup"
import FormControl from "react-bootstrap/cjs/FormControl"
import {useHttp} from "../hooks/http.hook"
import {useMessage} from "../hooks/message.hook";
const SignUpForm = ({signUpIsOpen, signUpClick, authChanged, name, password, email, authPassed}) => {
    const message = useMessage()
    const {error, clearError, request} = useHttp()
    useEffect( () => {
        message(error)
        clearError()
    }, [error, message, clearError])
    const signUpHandler = async () => {
        try {
            await request('/api/auth/register', 'POST', {name, password, email})
            const data = await request('/api/auth/login', 'POST', {name, password})
            const storageName = 'userData'
            authPassed({token: data.token, userId: data.userId})
            message(data.message)
            localStorage.setItem(storageName, JSON.stringify({userId: data.userId, token: data.token, isAuthorized: true}))
        } catch (e) {}
    }
    return (
        <div>
            <Modal show={signUpIsOpen} onHide={signUpClick}>
                <Modal.Header>
                    <Modal.Title>Sign Up</Modal.Title>
                    <button type="button" className="close" onClick={signUpClick}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Enter your Email"
                            aria-label="Email"
                            id="email"
                            onChange={event => authChanged({name: name, email: event.target.value, password: password})}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Name</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Enter your Name"
                            aria-label="Name"
                            id="name"
                            onChange={event => authChanged({name: event.target.value, email: email, password: password})}
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
                            onChange={event => authChanged({name: name, email: email, password: event.target.value})}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={signUpClick}>
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={signUpHandler}>
                        Sign Up
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        signUpIsOpen: state.signUpIsOpen,
        name: state.name,
        email: state.email,
        password: state.password,

    }
}
const mapDespatchToProps = (dispatch) => {
    const {signUpClick} = bindActionCreators(actions, dispatch)
    const {authChanged} = bindActionCreators(actions, dispatch)
    const {authPassed} = bindActionCreators(actions, dispatch)
    return {signUpClick, authChanged, authPassed}
}
export default connect(mapStateToProps, mapDespatchToProps)(SignUpForm)