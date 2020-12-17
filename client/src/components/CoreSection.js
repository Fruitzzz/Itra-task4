import React, {useCallback, useEffect} from 'react'
import Toolbar from './Toolbar'
import {connect} from 'react-redux'
import UserList from './UserList'
import {useHttp} from '../hooks/http.hook'
import {bindActionCreators} from 'redux'
import * as actions from '../actions'
const CoreSection = ({isAuthorized, users, setUsers}) => {
    const {request, loading} = useHttp()
    const fetchUsers = useCallback(async () => {
        try {
            if(isAuthorized) {
                const fetched = await request('/api/auth/getUsers', 'GET', null)
                setUsers(fetched)
            }
        }
        catch (e){} }, [request, setUsers, isAuthorized])
    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])
    if(loading) {
        return (
            <div className="container">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border " role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }
    if(isAuthorized && users && !loading) {
        return (
            <div className="container">
                <Toolbar/>
                <UserList users={users}/>
            </div>
        )
    }
    return (
        <div className="container ">
            <h1 className="core-section-text">You need to Sign In</h1>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        token: state.token,
        userId: state.userId,
        isAuthorized: state.isAuthorized,
        users: state.users
    }
}
const mapDespatchToProps = (dispatch) => {
    const {setUsers} = bindActionCreators(actions, dispatch)
    return {setUsers}
}
export default connect(mapStateToProps, mapDespatchToProps)(CoreSection)

