const {Router} = require('express')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const router = Router()

router.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    }
    catch (e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

router.post('/register',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'The password length must be greater than 6').isLength({min: 1})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data"
            })
        }
        const {email, name, password} = req.body
        const candidate = await User.findOne({$or: [
            {email}, {name}
            ]})
        if(candidate) {
            res.status(400).json({message: "Such user already exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const currentDate = new Date()
        const today = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}`
        const user = new User({email, name, password: hashedPassword, registrationDate: today, lastLoginDate: today, block: false})
        await user.save()
        res.status(201).json({message: 'User was created'})

    } catch(e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

router.post('/login',
    check('password', 'Enter password').exists(),
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data"
            })
        }
        const {name, password} = req.body
        const testUser = await User.findOne({name})
        if(!testUser) {
            res.status(400).json({message: "User doesnt exist"})
        }
        if(testUser.block) {
            res.status(400).json({message: "User blocked"})
        }
        if(!await bcrypt.compare(password, testUser.password)) {
            res.status(400).json({message: "Invalid password"})
        }
        const token = jwt.sign (
            {userId: testUser.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
        const currentDate = new Date()
        const today = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}
        ${currentDate.getHours()}:${currentDate.getMinutes()}`
        const user = await User.findOneAndUpdate({name}, {lastLoginDate: today})
        res.json({token, userId: user.id, block: user.block})
    } catch(e) {
        try {
            res.status(500).json({message: 'Something went wrong, try again'})
        } catch (e) {}
    }
})

module.exports = router