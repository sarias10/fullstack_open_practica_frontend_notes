import axios from 'axios'
const baseUrl = '/api/users'

const register = async (username, name, password) => {
  const response = await axios.post(baseUrl, {
    username: username,
    name: name,
    password: password
  })
  return response
}

export default { register }