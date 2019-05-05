import React from 'react'
import PropTypes from 'prop-types'
import './progressbar.scss'
//Props
//switch Bool 开关，默认开启，true正常运行,false停止
//mode String 计时/进度显示 timer对应计时，配合duration使用；progress对应进度显示，配合progress属性使用
//duration Number 单位sec
//progress Number 范围0-200
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
      ctx.clearRect(0, 0, count.w, count.h)
      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fillRect(0, 0, (count.c * count.w) / 200, count.h)
    }
    this.counter = (ctx, count) => {
      count.c++
      this.paint(ctx, count)
      if (count.c === 200) {
        if (this.props.callback) {
          this.props.callback()
        }
        count.c = 0
      }
    }
  }

  componentDidMount() {
    if (this.props.switch) {
      if (this.props.mode === 'timer') {
        let [w, h, ctx, duration] = [
          this.props.width,
          this.props.height,
          this.ctx,
          this.props.duration
        ]

        if (isNaN(duration) || duration <= 0) {
          throw new Error('Invalid value!')
        }

        this.count = {
          w: w,
          h: h,
          c: 0
        }
        this.paintTimer = setInterval(
          this.counter,
          duration * 5,
          ctx,
          this.count
        )
      } else if (this.props.mode === 'progress') {
        if (
          isNaN(this.props.progress) ||
          this.props.progress < 0 ||
          this.props.progress > 200
        ) {
          throw new Error('Invalid value, scope should be 0 to 200!')
        }
        let [w, h, c, ctx] = [
          this.props.width,
          this.props.height,
          this.props.progress,
          this.ctx
        ]

        this.count = {
          w: w,
          h: h,
          c: c
        }
        this.paint(ctx, this.count)
      }
    }
  }

  componentDidUpdate(prevProps) {
    let [w, h, ctx] = [this.props.width, this.props.height, this.ctx]

    //宽度自适应
    if (this.props.width !== prevProps.width) {
      if (this.props.switch) {
        this.count.w = this.props.width
      }
    }

    //开关状态切换处理
    if (this.props.switch !== prevProps.switch) {
      if (this.props.switch) {
        if (this.props.mode === 'timer') {
          let duration = this.props.duration

          this.paintTimer = setInterval(
            this.counter,
            duration * 5,
            ctx,
            this.count
          )
        } else if (this.props.mode === 'progress') {
          this.count.c = this.props.progress
          this.paint(ctx, this.count)
        }
      } else {
        ctx.clearRect(0, 0, w, h)
        this.count.c = 0
        if (this.props.mode === 'timer') {
          clearInterval(this.paintTimer)
        }
      }
    }

    //进度显示mode，当进度变化时，更新视图层上的进度显示
    if (this.props.switch && this.props.mode === 'progress') {
      if (this.props.progress !== prevProps.progress) {
        this.count.c = this.props.progress
        this.paint(ctx, this.count)
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
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  mode: PropTypes.oneOf(['timer', 'progress']).isRequired,
  duration: PropTypes.number,
  progress: PropTypes.number,
  callback: PropTypes.func
}

ProgressBar.defaultProps = {
  switch: true
}

export default ProgressBar
