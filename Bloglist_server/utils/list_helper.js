const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const initialValue = 0
    const totalLikes = blogs.reduce((accumulator, item) => accumulator + item.likes, initialValue)
    return totalLikes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const maxLikes = Math.max(...blogs.map(e => e.likes))
    const objWithMaxLikes = blogs.find(blog => blog.likes === maxLikes)
    const { _id, url, __v, ...returnBlogObj } = objWithMaxLikes
    return returnBlogObj
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const grouped = _.groupBy(blogs, author => author.author)
    const blogAmountByAuthor = []
    Object.keys(grouped).forEach(k => {
        const blogAmount = grouped[k].length
        blogAmountByAuthor.push({ author: k, blogs: blogAmount })
    })

    // Find author that has most blogs
    const mostBlogs = Math.max(...blogAmountByAuthor.map(e => e.blogs))
    const objWithMostBlogs = blogAmountByAuthor.find(e => e.blogs === mostBlogs)
    return objWithMostBlogs
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const grouped = _.groupBy(blogs, author => author.author)
    const likeAmountByAuthor = []
    Object.keys(grouped).forEach(k => {
        const likeAmount = grouped[k].reduce((acc, item) => acc + item.likes, 0)
        likeAmountByAuthor.push({ author: k, likes: likeAmount })
    })

    // Find author whose blogs have most likes
    const mostLikes = Math.max(...likeAmountByAuthor.map(e => e.likes))
    const objWithMostLikes = likeAmountByAuthor.find(e => e.likes === mostLikes)
    return objWithMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
