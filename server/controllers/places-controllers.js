const uuid = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')

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

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    )
    return next(error)
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    )
    return next(error)
  }
  res.json({ place: place.toObject({ getters: true }) })
}

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid

  let places
  try {
    places = await Place.find({ creator: userId })
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    )
  }
  res.json({ places: places.map((place) => place.toObject({ getters: true })) })
}

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description, address, creator } = req.body

  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }

  const createPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    creator,
  })

  try {
    await createPlace.save()
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500)
    return next(error)
  }

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
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId)
  res.status(200).json({ message: 'Deleted place.' })
}
