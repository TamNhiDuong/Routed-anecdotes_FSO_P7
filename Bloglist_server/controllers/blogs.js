const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const _ = require('lodash')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user')
        response.json(blogs)
    } catch (e) {
        next(e)
    }

})

blogsRouter.post('/', async (request, response, next) => {
    try {
        const reqBody = request.body

        if (request.user) {
            const user = request.user
            // console.log('request:::::::::.', request)
            if (!_.has(reqBody, 'url') || !_.has(reqBody, 'title')) {
                return response.status(400).json({ error: 'content missing' })
            } else {
                if (!_.has(reqBody, 'likes')) {
                    reqBody.likes = 0
                }
            }
            const blog = new Blog({ ...reqBody, user: user.id })

            const result = await blog.save()
            await result.populate('user')
            console.log('result: ', result)

            user.blogs = user.blogs.concat(result._id)
            console.log('user: ', user)
            await user.save()
            response.status(201).json(result)
        } else {
            return response.status(401).json({ error: 'user not found' })
        }
    } catch (e) {
        next(e)
    }

})

blogsRouter.delete('/:id', async (request, response, next) => {
    // token handling
    try {
        if (request.user) {
            const user = request.user
            const blog = await Blog.findById(request.params.id)
            if (user.id.toString() === blog.user.toString()) {
                await Blog.findByIdAndRemove(request.params.id)
                response.status(204).end()
            } else {
                return response.status(401).json({ error: 'user is not creator' })
            }
        } else {
            return response.status(401).json({ error: 'user not found' })
        }
    } catch (e) {
        next(e)
    }

})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        await updatedBlog.populate('user')
        response.json(updatedBlog)
    } catch (e) {
        next(e)
    }
})


module.exports = blogsRouter