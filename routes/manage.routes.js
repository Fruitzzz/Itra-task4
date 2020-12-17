const {Router} = require('express')
const router = Router()
const User = require('../models/User')
router.post('/block', async (req, res) => {
    try {
        const {selectedUsers} = req.body
        manage(selectedUsers, true)
        res.status(201).json({message: 'user/users was blocked'})
    } catch (e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})
router.post('/unblock', async (req, res) => {
    try {
        const {selectedUsers} = req.body
        manage(selectedUsers, false)
        res.status(201).json({message: 'user/users was unblocked'})
    } catch (e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})
router.post('/delete', async (req, res) => {
    try {
        const {selectedUsers} = req.body
        selectedUsers.forEach((item) => {
            User.findByIdAndRemove(item, () => {})
        })
        res.status(201).json({message: 'user/users was deleted'})
    } catch (e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})
const manage = (users, block) => {
    users.forEach((item) => {
        User.findByIdAndUpdate(item, {block: block}, () => {
        })
    })
}
module.exports = router