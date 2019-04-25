import React from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'
import ProgressBar from './progressbar'
import styles from './banner.module.scss'
//Props
//userClass String 用户自定义类名
//duration Number 轮播切换时间，单位sec
//srcArr Array 存放图片地址的数组，以数组顺序作为轮播顺序
//showProgress Bool 是否显示进度条，显示则使用ProgressBar组件的回调机制，不显示则内建定时器执行轮播
//showIndex Bool 是否显示当前轮播序号，默认显示

class Banner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 0,
      in: true,
      switch: true,
      appear: false
    }

    this.bannerRef = null
    this.getBannerRef = e => {
      this.bannerRef = e
    }
    this.goBack = () => {
      this.setState((prevState, props) => {
        if (prevState.order === 0) {
          return {
            order: props.srcArr.length - 1,
            in: true
          }
        } else {
          return {
            order: prevState.order - 1,
            in: true
          }
        }
      })
    }
    this.goAhead = () => {
      this.setState((prevState, props) => {
        if (prevState.order === props.srcArr.length - 1) {
          return {
            order: 0,
            in: true
          }
        } else {
          return {
            order: prevState.order + 1,
            in: true
          }
        }
      })
    }
    this.change = () => {
      this.setState(
        {
          in: false
        },
        () => {
          setTimeout(() => {
            this.goAhead()
          }, 410)
        }
      )
    }
    this.last = () => {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.setState(
        {
          in: false,
          switch: false
        },
        () => {
          setTimeout(() => {
            this.timer = setInterval(this.change, this.props.duration * 1000)
            this.goBack()
            this.setState({
              switch: true
            })
          }, 405)
        }
      )
    }
    this.next = () => {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.setState(
        {
          in: false,
          switch: false
        },
        () => {
          setTimeout(() => {
            this.timer = setInterval(this.change, this.props.duration * 1000)
            this.goAhead()
            this.setState({
              switch: true
            })
          }, 405)
        }
      )
    }
    this.appear = () => {
      this.setState({
        appear: true
      })
    }
    this.disappear = () => {
      this.setState({
        appear: false
      })
    }
  }

  componentDidMount() {
    if (!this.props.showProgress) {
      this.timer = setInterval(this.change, this.props.duration * 1000)
    }
  }

  render() {
    let srcArr = this.props.srcArr
    let showProgress = this.props.showProgress
    let showIndex = this.props.showIndex
    let arrow = ['<', '>']
    let bannerWidth = this.bannerRef ? this.bannerRef.offsetWidth : 0

    return (
      <div
        ref={this.getBannerRef}
        onMouseEnter={this.appear}
        onMouseLeave={this.disappear}
        className={(this.props.userClass + ' ' + styles.default).trim()}
      >
        {this.state.appear && (
          <div className={styles.toggle}>
            <button onClick={this.last}>{arrow[0]}</button>
            <button onClick={this.next}>{arrow[1]}</button>
          </div>
        )}
        {showIndex && (
          <div className={styles.index}>
            {this.state.order + 1 + '/' + srcArr.length}
          </div>
        )}
        <div className={styles.wrapper}>
          <Transition
            in={this.state.in}
            timeout={400}
            appear
            mountOnEnter
            unmountOnExit
          >
            {state => (
              <img
                src={srcArr[this.state.order]}
                alt={'banner'}
                className={styles.img + ' ' + styles['img-' + state]}
              />
            )}
          </Transition>
        </div>
        {showProgress && (
          <ProgressBar
            switch={this.state.switch}
            width={bannerWidth}
            height={10}
            duration={this.props.duration}
            callback={this.change}
          />
        )}
      </div>
    )
  }
}

Banner.propTypes = {
  userClass: PropTypes.string,
  showIndex: PropTypes.bool,
  showProgress: PropTypes.bool,
  srcArr: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired
}
Banner.defaultProps = {
  userClass: '',
  showIndex: false,
  showProgress: false
}

export default Banner
