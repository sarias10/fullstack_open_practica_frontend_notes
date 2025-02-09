import PropTypes from 'prop-types'
import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className='togglableContent'>
        {props.children}
        <button onClick={toggleVisibility}>cancel {props.buttonLabel}</button>
      </div>
    </div>
  )
})

// Muestra un mensaje en consola sino se pasa buttonLabel al componente
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

//se usa para que en las herramientas de depuracion aparezca Togglable y no ForwardRef
Togglable.displayName = 'Togglable'

export default Togglable