import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import styles from './mask.module.scss'
//Props
//transitionClass String 需要过渡效果时添加，无需过渡可不加
//openMask Bool 必填，控制蒙层的开关
//timeout Number 定义进出状态变化的持续时间，默认1s

class Mask extends React.Component {
  render() {
    return (
      <CSSTransition
        unmountOnExit
        classNames={this.props.transitionClass}
        in={this.props.openMask}
        timeout={this.props.timeout}
      >
        <div className={styles.mask + ' ' + this.props.transitionClass}>
          {this.props.children}
        </div>
      </CSSTransition>
    )
  }
}

Mask.propTypes = {
  timeout: PropTypes.number,
  openMask: PropTypes.bool.isRequired,
  transitionClass: PropTypes.string
}

Mask.defaultProps = {
  timeout: 1000
}

export default Mask
