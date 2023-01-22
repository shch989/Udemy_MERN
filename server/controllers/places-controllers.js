const uuid = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u1',
  },
]

exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId
  })

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404)
  }
  res.json({ place })
}

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId
  })

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    )
  }
  res.json({ places })
}

exports.createPlace = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const { title, description, coordinates, address, creator } = req.body
  const createPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  }

  DUMMY_PLACES.push(createPlace)
  res.status(201).json({ place: createPlace })
}

exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const { title, description } = req.body
  const placeId = req.params.pid

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({ place: updatedPlace })
}

exports.deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  if(!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId)
  res.status(200).json({ message: 'Deleted place.' })
}
