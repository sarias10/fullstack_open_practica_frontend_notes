import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import noteservice from './services/notes'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import { useLocalStorage } from './utils/useLocalStorage'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useLocalStorage('user', null) //guarda un objeto que tiene el token, username y name

  const noteFormRef = useRef()

  useEffect(() => {
    noteservice
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  //para manejar la primera carga de la pagina
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteservice.setToken(user.token)
    }
  }, []) //se ejecuta solo cuando el componente se renderiza por primera vez

  const handleLogin = async (event) => {
    //evita que se recargue la pagina
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      //cuando se inicia sesion, los datos de un usuario se guardan en el almacenamiento local
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      //asigna a la variable token del archivo serveces/notes Bearer token
      noteservice.setToken(user.token)
      setUser(user) //guarda el objeto con el token, username y name
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = () => {
    try{
      window.localStorage.removeItem('loggedNoteappUser')
      setUser(null)
      noteservice.setToken(null)
    } catch(error){
      setErrorMessage('Wrong Log out')
    }
  }
  const toggleImportanceof = (id) => {
    const note = notes.find(n => n.id ===id)
    const changedNote = { ...note, important: !note.important }

    noteservice
      .update(id,changedNote)
      .then(returnedNNote => {
        setNotes(notes.map(n => n.id !== id ? n:returnedNNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        },5000)
        setNotes(notes.filter(n => n.id !==id))
      })
  }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteservice
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important ===true)

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const registerForm = () => (
    <Togglable buttonLabel='register'>
      <RegisterForm
        setUser={setUser}
      />
    </Togglable>
  )

  const logOutButton = () => (
    <>
      <button onClick={handleLogOut}>
        log out
      </button>
    </>
  )

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote}/>
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {/* se utiliza para representar los formularios de manera condicional */}
      {user === null ? (
        <>
          {loginForm()}
          {registerForm()}
        </>
      ):(
        <div>
          <p>{user.name} logged-in</p> {/*si el usuario esta loggeado muestra su nombre en la pantalla que ya viene en el estado user*/}
          {logOutButton()}
          {noteForm()} {/*muestra el formulario para ingresar notas */}
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {
          notesToShow.map(note => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceof(note.id)}
            />
          ))}

      </ul>
      <Footer />
    </div>
  )
}


export default App
