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
      arrowAppear: false,
      onExitedNow: null
    }
    this.ImgS = ({ s, srcArr }) => <Transition
      in={s.in}
      timeout={200}
      appear
      mountOnEnter
      unmountOnExit
      onExited={this.timerJudgeWrapper.bind(this, this.state.onExitedNow)}
    >
      {state => (
        <img
          src={
            typeof srcArr[s.order] === 'object'
              ? srcArr[s.order]['src']
              : srcArr[s.order]
          }
          alt={'banner'}
          className={styles.img + ' ' + styles['img-' + state]}
        />
      )}
    </Transition>

    this.bannerRef = null
    this.getBannerRef = e => {
      this.bannerRef = e
    }
    this.goBack = () => {
      this.setState((prevState, props) => {
        if (prevState.order === 0) {
          return {
            order: props.srcArr.length - 1,
            in: true,
            switch: true
          }
        } else {
          return {
            order: prevState.order - 1,
            in: true,
            switch: true
          }
        }
      })
    }
    this.goAhead = () => {
      this.setState((prevState, props) => {
        if (prevState.order === props.srcArr.length - 1) {
          return {
            order: 0,
            switch: true,
            in: true
          }
        } else {
          return {
            order: prevState.order + 1,
            switch: true,
            in: true
          }
        }
      })
    }
    this.goTo = idx => {
      this.setState({
        order: idx,
        in: true,
        switch: true
      })
    }
    this.timerJudgeWrapper = action => {
      if (!this.props.showProgress) {
        this.timer = setInterval(this.change, this.props.duration * 1000)
      }
      action()
    }
    this.actionChange = (action, idx) => {
      this.setState(() => {
        if (this.timer) clearInterval(this.timer)
        if (typeof idx === 'number') return { in: false, switch: false, onExitedNow: () => action(idx) }
        return { in: false, switch: false, onExitedNow: action }
      })
    }
    this.change = () => {
      if (this.timer) clearInterval(this.timer)
      this.setState(
        {
          in: false,
          switch: false,
          onExitedNow: this.goAhead
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
    let { srcArr, showProgress, showDots } = this.props
    let arrow = ['<', '>']
    let dots = srcArr.map((val, idx) => (
      <div
        key={idx}
        className={(
          styles.dots +
          ' ' +
          (this.state.order === idx ? styles['dots-selected'] : '')
        ).trim()}
        onClick={() => this.actionChange(this.goTo, idx)}
      />
    ))
    let bannerWidth = this.bannerRef ? this.bannerRef.offsetWidth : 0
    const ImgS = this.ImgS

    return (
      <div
        ref={this.getBannerRef}
        onMouseEnter={this.appear}
        onMouseLeave={this.disappear}
        className={(this.props.userClass + ' ' + styles.default).trim()}
      >
        {this.state.arrowAppear && (
          <>
            <button className={styles.arrow0} onClick={() => this.actionChange(this.goBack)}>
              {arrow[0]}
            </button>
            <button className={styles.arrow1} onClick={() => this.actionChange(this.goAhead)}>
              {arrow[1]}
            </button>
          </>
        )}
        {showDots && <div className={styles.index}>{dots}</div>}
        <div className={styles.wrapper}>
          {typeof srcArr[this.state.order] === 'object' ? <a
            className={styles.href} href={srcArr[this.state.order].url} target='_blank' rel='noopener noreferrer'><ImgS s={this.state} srcArr={srcArr} /></a> : <ImgS s={this.state} srcArr={srcArr} />}
        </div>
        {showProgress && (
          <ProgressBar
            switch={this.state.switch}
            width={bannerWidth * 0.8}
            height={10}
            mode={'timer'}
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
