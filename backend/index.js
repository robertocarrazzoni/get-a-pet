const express = require('express')
const cors = require('cors')

const app = express()

// config JSON response
app.use(express.json())

// solve cors
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// public folder for images
app.use(express.static('public'))

// routes
const UserRoutes = require('./routes/UserRoutes')
const PetRouter = require('./routes/PetRouter')

app.use('/users', UserRoutes)
app.use('/pets', PetRouter)

app.listen(5000)