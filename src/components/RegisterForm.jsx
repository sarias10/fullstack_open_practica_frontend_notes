import { useState } from 'react'
import noteservice from '../services/notes'
import registerService from '../services/register'
import loginService from '../services/login'

const RegisterForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async(event) => {
    event.preventDefault()
    try{
      const responseRegister = await registerService.register(username,name,password)
      if(responseRegister.status === 201){
        // se obtiene el usuario como respuesta de la petición
        const user = await loginService.login({ username, password })
        // se guarda en la variable de estado user
        setUser(user)
        // se establece el token
        noteservice.setToken(user.token)
        // se guarda el usuario en el localstorage
        window.localStorage.setItem('user', JSON.stringify(user))
      }
      setUsername('')
      setName('')
      setPassword('')
    }catch(error){
      setUsername('')
      setName('')
      setPassword('')
    }
  }

  return (
    <>
      <h2>Register in to application</h2>
      <form onSubmit={handleRegister}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          name
          <input
            type="text"
            value={name}
            name="Name"
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">register</button>
      </form>
    </>
  )
}

export default RegisterForm