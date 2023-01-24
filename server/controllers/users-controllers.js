const uuid = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
]

exports.getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password')
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    )
    return next(error)
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) })
}

exports.signup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }
  const { name, email, password, places } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    )
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    )
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    image:
      'https://image.jtbcplus.kr/data/contents/jam_photo/202301/11/d4b19cb8-f1cd-4a0d-8c06-a12eef725d21.jpg',
    password,
    places,
  })

  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again', 500)
    return next(error)
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    )
    return next(error)
  }

  res.json({ message: 'Logged in' })
}
