import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateBlog = async (blogId, blogObj) => {
  const config = {
    headers: { Authorization: token },
  }

  const url = baseUrl + '/' + blogId

  const response = await axios.put(url, blogObj, config)
  return response.data
}


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }

  const url = baseUrl + '/' + blogId

  const response = await axios.delete(url, config)
  return response.data
}

// eslint-disable-next-line
export default { getAll, create, setToken, updateBlog, deleteBlog }