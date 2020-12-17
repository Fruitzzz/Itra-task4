const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/manage', require('./routes/manage.routes'))


if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static('client/build'))
}
async function start() {
    try {
        await mongoose.connect( process.env.MONGODB_URI || config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    }
    catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}
start()