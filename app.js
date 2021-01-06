const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./models/db')
const passport = require('passport')
const session = require('express-session')

dotenv.config({path: '.env'});
const app = express()
connectDB()

require('./middleware/passport')(passport)

app.use(session({
    secret: 'My secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

if (process.env.NODE_ENV  === 'develpoment'){
    app.use(morgan('dev'))
}
// routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

app.engine('.hbs', exphbs({defaultLayout:'main', extname: '.hbs'}));
app.set('view engine','.hbs')

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} on Port ${PORT}`))