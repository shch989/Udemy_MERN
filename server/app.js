const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

require('dotenv').config();

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

const app = express()
const cors = require('cors');

app.use(bodyParser.json())

app.use(cors());

app.use('/api/places/', placesRoutes)
app.use('/api/users/', usersRoutes)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error occurred!' })
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(5000, () => {
      console.log(`Example app listening at http://localhost:5000/`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
