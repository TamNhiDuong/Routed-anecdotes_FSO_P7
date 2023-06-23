import PropTypes from 'prop-types'

const Togglable = (props) => {
  const { buttonLabel, closeButtonLabel, setVisible, visible } = props

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      {props.children}

      <div style={visible ? showWhenVisible: hideWhenVisible}>
        <button onClick={toggleVisibility}>{visible ? closeButtonLabel : buttonLabel}</button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  closeButtonLabel: PropTypes.string.isRequired,
  setVisible: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable