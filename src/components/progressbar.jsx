import React from 'react'
import PropTypes from 'prop-types'
import './progressbar.scss'
//Props
//switch Bool 开关，默认开启，true正常运行,false停止
//duration Number 单位sec
//width Number 单位px
//height Number 单位px
//callback Function 计时每满一次，触发回调

class ProgressBar extends React.Component {
  constructor(props) {
    super(props)

    this.ctx = null //canvas上下文
    this.count = null //绘图用，保存一些关键数据
    this.getCtx = ele => {
      this.ctx = ele.getContext('2d')
    }
    this.paint = (ctx, count) => {
      count.c++
      ctx.clearRect(0, 0, count.w, count.h)
      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fillRect(0, 0, (count.c * count.w) / 200, count.h)
      if (count.c === 200) {
        if (this.props.callback) {
          this.props.callback()
        }
        count.c = 0
      }
    }
  }

  componentDidMount() {
    let [w, h, ctx, duration] = [
      this.props.width,
      this.props.height,
      this.ctx,
      this.props.duration
    ]
    this.count = {
      w: w,
      h: h,
      c: 0
    }

    if (this.props.switch) {
      this.paintTimer = setInterval(this.paint, duration * 5, ctx, this.count)
    }
  }

  componentDidUpdate(prevProps) {
    let [w, h, ctx, duration] = [
      this.props.width,
      this.props.height,
      this.ctx,
      this.props.duration
    ]

    if (this.props.width !== prevProps.width) {
      if (this.props.switch) {
        this.count.w = this.props.width
      }
    }
    if (this.props.switch !== prevProps.switch) {
      if (this.props.switch) {
        this.paintTimer = setInterval(this.paint, duration * 5, ctx, this.count)
      } else {
        ctx.clearRect(0, 0, w, h)
        this.count.c = 0
        clearInterval(this.paintTimer)
      }
    }
  }

  render() {
    return (
      <canvas
        ref={this.getCtx}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}

ProgressBar.propTypes = {
  callback: PropTypes.func
}

ProgressBar.defaultProps = {
  switch: true
}

export default ProgressBar
