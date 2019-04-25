import React from 'react'
import PropTypes from 'prop-types'
import styles from './nav.module.scss'
//Props
//userClass String 用户自定义类名

class Nav extends React.Component {
  render() {
    return (
      <nav className={(this.props.userClass + ' ' + styles.content).trim()}>
        {this.props.children}
      </nav>
    )
  }
}

Nav.propTypes = {
  userClass: PropTypes.string
}

Nav.defaultProps = {
  userClass: ''
}

export default Nav
