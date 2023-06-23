import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'

import { setNotification } from '../src/reducers/notificationReducer'
import { initBlogs, setBlogs, createBlog } from './reducers/blogsReducer'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

  const dispatch = useDispatch()
  const blogs = useSelector(state => {
    return state.blogs
  })

  const sortBlogsByLikes = (blogs) => {
    const blogsWithLikes = blogs.filter((b) => b.likes !== undefined)
    const blogsWithoutLikes = blogs.filter((b) => b.likes === undefined)
    const sortedBlogs = blogsWithLikes.sort((a, b) =>
      a.likes < b.likes ? 1 : b.likes < a.likes ? -1 : 0
    )
    return sortedBlogs.concat(blogsWithoutLikes)
  }

  useEffect(() => {
    dispatch(initBlogs())
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      // Save user to local storage
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      // notify
      dispatch(setNotification('Login succeed', 5000))
    } catch (exception) {
      // notify
      dispatch(setNotification('Wrong credentials', 5000))
    }
  }

  const addBlog = async (blog) => {
    setNewBlogFormVisible(false)

    try {
      dispatch(createBlog(blog))

      // notify
      dispatch(setNotification('New blog added', 5000))
    } catch (e) {
      // notify
      dispatch(setNotification('Cannot add new blog', 5000))
    }
  }

  const updateBlog = async (id, blog) => {
    try {
      const updateBlogObj = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }
      const updatedBlog = await blogService.updateBlog(id, updateBlogObj)
      const clonedBlogs = [...blogs]
      clonedBlogs.forEach((b, i) => {
        if (b.id === updatedBlog.id) {
          clonedBlogs[i] = updatedBlog
        }
      })
      const sortedBlogs = sortBlogsByLikes(clonedBlogs)
      dispatch(setBlogs(sortedBlogs))

      // notify
      dispatch(setNotification('Likes has been updated', 5000))
    } catch (e) {
      // notify
      dispatch(setNotification('Cannot like', 5000))
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id)
      const filteredBlogs = blogs.filter((b) => b.id !== id)
      dispatch(setBlogs(filteredBlogs))

      // notify
      dispatch(setNotification('Blog deleted', 5000))
    } catch (e) {
      // notify
      dispatch(setNotification('Cannot delete', 5000))
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    dispatch(setBlogs([]))
  }

  const userInfo = () => {
    return (
      <div>
        <p>{user.name} logged in</p>
        <button onClick={logout}>logout</button>
      </div>
    )
  }

  const blogList = () => {
    return (
      <div>
        <h2>blogs</h2>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            user={user}
            deleteBlog={deleteBlog}
          />
        ))}
      </div>
    )
  }

  const hideWhenFormVisible = { display: newBlogFormVisible ? 'none' : '' }
  const showWhenFormVisible = { display: newBlogFormVisible ? '' : 'none' }

  return (
    <div>
      <Notification/>
      {!user && loginForm()}
      {user && (
        <div>
          {userInfo()}

          <div style={hideWhenFormVisible}>
            <button onClick={() => setNewBlogFormVisible(true)}>
              new blog
            </button>
          </div>

          <div style={showWhenFormVisible}>
            <NewBlogForm addBlog={addBlog} />
            <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
          </div>

          {blogList()}
        </div>
      )}
    </div>
  )
}

export default App
