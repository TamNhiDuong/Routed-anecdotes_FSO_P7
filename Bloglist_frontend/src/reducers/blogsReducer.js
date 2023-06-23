import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'

const sortBlogsByLikes = (blogs) => {
  const blogsWithLikes = blogs.filter((b) => b.likes !== undefined)
  const blogsWithoutLikes = blogs.filter((b) => b.likes === undefined)
  const sortedBlogs = blogsWithLikes.sort((a, b) =>
    a.likes < b.likes ? 1 : b.likes < a.likes ? -1 : 0
  )
  return sortedBlogs.concat(blogsWithoutLikes)
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addNewBlog(state, action) {
      const blogObj = action.payload
      state.push(blogObj)
    },
    appendBlogs(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    }
  }
})

export const { addNewBlog, appendBlogs, setBlogs } = blogSlice.actions

export const initBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const sortedBlogs = sortBlogsByLikes(blogs)
    dispatch(setBlogs(sortedBlogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlogs(newBlog))
  }
}

export default blogSlice.reducer

