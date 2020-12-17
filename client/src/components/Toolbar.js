import React, {useCallback, useEffect} from 'react'
import PersonBlock from '../images/PersonBlock.svg'
import PersonUnBlock from '../images/PersonUnblock.svg'
import PersonRemove from '../images/Trash.svg'
import {useHttp} from '../hooks/http.hook'
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import * as actions from "../actions";
const Toolbar = ({selectedUsers, userId, setUsers, users, logOut, isAuthorized}) => {
    const {request, loading} = useHttp()
    const blockUsers = async () => {
        try {
                await request('/api/manage/block', 'POST', {selectedUsers})
                await fetchUsers()
            }
        catch (e) {}
    }
    const unblockUsers = async () => {
        try {
                await request('/api/manage/unblock', 'POST', {selectedUsers})
                await fetchUsers()
        }
        catch (e) {}
    }
    const deleteUsers = async () => {
        try {
                await request('/api/manage/delete', 'POST', {selectedUsers})
                await fetchUsers()
        }
        catch (e) {}
    }
    const fetchUsers = async () => {
        try {
            const fetched = await request('/api/auth/getUsers', 'GET', null)
            await setUsers(fetched)
        } catch (e) {}
    }
    const checkSignIn = useCallback(async () => {
        try {
            if(!users.find(item => item._id === userId)) {
                localStorage.removeItem('userData')
                logOut()
            }

            else {
                users.forEach(item => {
                    if (item._id === userId && item.block) {
                        localStorage.removeItem('userData')
                        logOut()
                    }
                })
            }
        } catch (e) {}
    }, [users, userId, logOut])
    useEffect(() => {
        checkSignIn()
    }, [checkSignIn])
    return (
        <div className="row justify-content-center toolbar">
            <button type="button" className="btn btn-default btn-lg" onClick={blockUsers} disabled={loading}>
                <img src={PersonBlock} alt="Block" height={30}/>
            </button>
            <button type="button" className="btn btn-default btn-lg" onClick={unblockUsers} disabled={loading}>
                <img src={PersonUnBlock} alt="Unblock" height={30} />
            </button>
            <button type="button" className="btn btn-default btn-lg" onClick={deleteUsers} disabled={loading}>
                <img src={PersonRemove} alt="Delete" height={30}/>
            </button>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        userId: state.userId,
        selectedUsers: state.selectedUsers,
        users: state.users,
        isAuthorized: state.isAuthorized
    }
}
const mapDespatchToProps = (dispatch) => {
    const {setUsers} = bindActionCreators(actions, dispatch)
    const {logOut} = bindActionCreators(actions, dispatch)
    return {setUsers, logOut}
}
export default connect(mapStateToProps, mapDespatchToProps)(Toolbar)