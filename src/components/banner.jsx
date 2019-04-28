import React from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'
import ProgressBar from './progressbar'
import styles from './banner.module.scss'
//Props
//userClass String 用户自定义类名
//duration Number 轮播切换时间，单位sec
/*srcArr Array 存放图片地址的数组，以数组顺序作为轮播顺序
  srcArr子元素 String/Object 如需同时将图片作为超链接，以对象{src: String, url: String} (url为希望跳转的网页链接)传入*/
//showProgress Bool 是否显示进度条，显示则使用ProgressBar组件的回调属性，不显示则内建定时器执行轮播
//showDots Bool 是否显示当前轮播序号，显示则用户可以通过点击Dot进行更高效的轮播图切换

class Banner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 0,
      in: true,
      switch: true,
      arrowAppear: false
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
    this.goTo = idx => {
      this.setState({
        order: idx,
        in: true
      })
    }

    //高阶函数，对不同的操作，组合一些重复性的逻辑，action Function，idx Number（特别用于goTo操作的参数）
    this.wrapperAction = (action, idx) => {
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
            if (!this.props.showProgress) {
              this.timer = setInterval(this.change, this.props.duration * 1000)
            }
            //操作由此开始
            if (!isNaN(idx)) {
              action(idx)
            } else {
              action()
            }
            //到此为止，其余皆是重复性逻辑
            this.setState({
              switch: true
            })
          }, 205)
        }
      )
    }

    this.change = () => {
      this.setState(
        {
          in: false
        },
        () => {
          setTimeout(() => {
            this.goAhead()
          }, 210)
        }
      )
    }
    this.appear = () => {
      this.setState({
        arrowAppear: true
      })
    }
    this.disappear = () => {
      this.setState({
        arrowAppear: false
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
    let showDots = this.props.showDots
    let arrow = ['<', '>']
    let dots = srcArr.map((val, idx) => (
      <div
        key={idx}
        className={(
          styles.dots +
          ' ' +
          (this.state.order === idx ? styles['dots-selected'] : '')
        ).trim()}
        onClick={() => this.wrapperAction(this.goTo, idx)}
      />
    ))
    let bannerWidth = this.bannerRef ? this.bannerRef.offsetWidth : 0

    return (
      <div
        ref={this.getBannerRef}
        onMouseEnter={this.appear}
        onMouseLeave={this.disappear}
        className={(this.props.userClass + ' ' + styles.default).trim()}
      >
        {this.state.arrowAppear && (
          <div className={styles.toggle}>
            <button onClick={() => this.wrapperAction(this.goBack)}>
              {arrow[0]}
            </button>
            <button onClick={() => this.wrapperAction(this.goAhead)}>
              {arrow[1]}
            </button>
          </div>
        )}
        {showDots && <div className={styles.index}>{dots}</div>}
        <div className={styles.wrapper}>
          <a
            className={styles.href}
            href={
              typeof srcArr[this.state.order] === 'object'
                ? srcArr[this.state.order].url
                : null
            }
            target="_blank"
          >
            <Transition
              in={this.state.in}
              timeout={200}
              appear
              mountOnEnter
              unmountOnExit
            >
              {state => (
                <img
                  src={
                    typeof srcArr[this.state.order] === 'object'
                      ? srcArr[this.state.order]['src']
                      : srcArr[this.state.order]
                  }
                  alt={'banner'}
                  className={styles.img + ' ' + styles['img-' + state]}
                />
              )}
            </Transition>
          </a>
        </div>
        {showProgress && (
          <ProgressBar
            switch={this.state.switch}
            width={bannerWidth * 0.8}
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
  showDots: PropTypes.bool,
  showProgress: PropTypes.bool,
  srcArr: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired
}
Banner.defaultProps = {
  userClass: '',
  showDots: false,
  showProgress: false
}

export default Banner
