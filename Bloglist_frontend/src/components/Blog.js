import Togglable from './Togglable'

import { useState } from 'react'

const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogDetails = () => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, ...blogStyle }} className='blogDetails'>
      <div>Title: {blog.title}</div>
      <div className='url'>Url: {blog.url}</div>
      <div className='like' >Likes: {blog.likes}
        <button onClick={() => updateBlog(blog.id, blog)} style={{ color: 'blue' }} className='lbtn'>like</button>
      </div>
      <div>Author: {blog.author}</div>
      <div>User: {blog.user ? blog.user.name : ''}</div>
      {(user && blog.user && user.id === blog.user.id) &&
        <button onClick={deleteB} name='delete' style={{ color: 'red' }}>delete</button>
      }

    </div>
  )

  const blogPreview = () => (
    <div style={blogStyle} className='blogPreview'>
      {blog.title} {blog.author}
    </div>
  )

  const deleteB = () => {
    if (window.confirm(`Do you really want delete blog: ${blog.title} ?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <>
      <Togglable buttonLabel='view' closeButtonLabel='hide' visible={visible} setVisible={(bool) => setVisible(bool)}>
        {visible ? blogDetails() : blogPreview()}
      </Togglable>
    </>


  )
}

export default Blog