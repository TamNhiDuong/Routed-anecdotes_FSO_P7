const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Test1",
        author: "10-334",
        url: "http://localhost:3003/api/blogs",
        likes: 10,
        id: "6449145ea146b589491b7f3e"
    },
    {
        title: "Test2",
        author: "10-334",
        url: "http://localhost:3003/api/blogs",
        likes: 10,
        id: "64491464a146b589491b7f40"
    },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}