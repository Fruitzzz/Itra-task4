import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../actions'
const UserList = ({users, selectedUsers, selectUser}) => {
    const checkboxEventHandle = (event) => {
            if(selectedUsers.indexOf(event.target.name) !== -1) {
                let newSelectedUsers = Array.from(selectedUsers).filter(item => item !== event.target.name)
                selectUser(newSelectedUsers)
            }
        else {
            selectUser([...selectedUsers, event.target.name])
        }
    }
    const isUserValid = (userId) => {
       return selectedUsers.indexOf(userId) !== -1
    }
    const isAllChecked = () => {
        return users.length === selectedUsers.length
    }
    return (
        <div className="row justify-content-center">
            <table className="w-100 cursor-none">
                <thead className="thead-dark">
                <tr>
                    <th scope="col" className="table-header">
                        <input type="checkbox" className="form-check-input position-static" checked={isAllChecked()} onChange={(event) => {
                            if(event.target.checked) {
                                const currentUsers = users.map((el) => {
                                    return el._id
                                })
                                selectUser(currentUsers)
                            }
                            else
                                selectUser([])
                        }}/>
                    </th>
                    <th scope="col" className="table-header">Id</th>
                    <th scope="col" className="table-header">Name</th>
                    <th scope="col" className="table-header">Email adress</th>
                    <th scope="col" className="table-header">Registration date</th>
                    <th scope="col" className="table-header">Last login date</th>
                    <th scope="col" className="table-header">Status</th>
                </tr>
                </thead>
                <tbody>
                {
                    users.map((user, index) => {
                    return (
                        <tr key={user._id} className={checkBlock(user)}>
                            <td className="table-data">
                                <input type="checkbox" className="form-check-input position-static" checked={isUserValid(user._id)} name={user._id} onChange={checkboxEventHandle}/>
                            </td>
                            <td className="table-data">{index}</td>
                            <td className="table-data">{user.name}</td>
                            <td className="table-data">{user.email}</td>
                            <td className="table-data">{user.registrationDate}</td>
                            <td className="table-data">{user.lastLoginDate}</td>
                            <td className="table-data">{user.block? 'Blocked' : 'Unblocked'}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

const checkBlock = (user) => {
    if(user.block)
        return 'blocked'
    return 'unblocked'
}
const mapStateToProps = (state) => {
    return {
        userId: state.userId,
        users: state.users,
        selectedUsers: state.selectedUsers,
        allSelected: state.allSelected
    }
}
const mapDespatchToProps = (dispatch) => {
    const {selectUser} = bindActionCreators(actions, dispatch)
    return {selectUser}
}
export default connect(mapStateToProps, mapDespatchToProps)(UserList)