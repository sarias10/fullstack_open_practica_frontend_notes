

const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important'
  return(
    <li className="note">
      <p>Your awesome note: {note.content}</p>
      <p>Note by: {note.user.name}</p>
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note