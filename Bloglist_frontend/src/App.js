import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

  const sortBlogsByLikes = (blogs) => {
    const blogsWithLikes = blogs.filter(b => b.likes !== undefined)
    const blogsWithoutLikes = blogs.filter(b => b.likes === undefined)
    const sortedBlogs = blogsWithLikes.sort((a, b) => (a.likes < b.likes) ? 1 : ((b.likes < a.likes) ? -1 : 0))
    return sortedBlogs.concat(blogsWithoutLikes)
  }

  useEffect(() => {
    async function fetchBlogs() {
      const blogs = await blogService.getAll()

      const sortedBlogs = sortBlogsByLikes(blogs)
      setBlogs(sortedBlogs)
    }
    fetchBlogs()
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
        username, password,
      })

      // Save user to local storage
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Login succeed')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blog) => {
    setNewBlogFormVisible(false)

    try {
      const savedBlog = await blogService.create(blog)
      const sortedBlogs = sortBlogsByLikes(blogs.concat(savedBlog))
      setBlogs(sortedBlogs)

      setSuccessMessage('New blog added')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (e) {
      setErrorMessage('Cannot add new blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
      setBlogs(sortedBlogs)

      setSuccessMessage('Likes has been updated')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (e) {
      setErrorMessage('Cannot update likes')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id)
      const filteredBlogs = blogs.filter(b => b.id !== id)
      setBlogs(filteredBlogs)

      setSuccessMessage('Blog deleted')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch(e) {
      setErrorMessage('Cannot delete')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
      <button type="submit" id="login-button">login</button>
    </form>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setBlogs([])
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
        {
          blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} user={user} deleteBlog={deleteBlog} />
          )
        }</div>
    )
  }

  const hideWhenFormVisible = { display: newBlogFormVisible ? 'none' : '' }
  const showWhenFormVisible = { display: newBlogFormVisible ? '' : 'none' }
  const successMessageStyle = { borderStyle: 'solid', borderWidth: 2, borderColor: 'blue', color: 'blue' }
  const errMessageStyle = { borderStyle: 'solid', borderWidth: 2, borderColor: 'red', color: 'red' }
  return (
    <div>
      {errorMessage && <p style={errMessageStyle}>{errorMessage}</p>}
      {successMessage && <p style={successMessageStyle}>{successMessage && successMessage}</p>}
      {!user && loginForm()}
      {user && <div>
        {userInfo()}

        <div style={hideWhenFormVisible}>
          <button onClick={() => setNewBlogFormVisible(true)}>new blog</button>
        </div>

        <div style={showWhenFormVisible}>
          <NewBlogForm addBlog={addBlog} />
          <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
        </div>


        {blogList()}
      </div>}
    </div>
  )
}

export default App