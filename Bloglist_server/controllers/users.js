const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    try {
        if (password) {
            if (password.length >= 3) {
                const saltRounds = 10
                const passwordHash = await bcrypt.hash(password, saltRounds)

                const user = new User({
                    username,
                    name,
                    passwordHash,
                })

                const savedUser = await user.save()

                response.status(201).json(savedUser)
            } else {
                return response.status(400).json({ error: 'password must be at least 3 characters' })
            }
        } else {
            return response.status(400).json({ error: 'password is missing' })
        }
    } catch (exception) {
        next(exception)
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter