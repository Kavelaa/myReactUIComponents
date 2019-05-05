import React from 'react'
import Header from './components/header'
import Nav from './components/nav'
import Mask from './components/mask'
import ProgressBar from './components/progressbar'
import Banner from './components/banner'
import './app.scss'

class App extends React.Component {
  state = {
    welcomeContent: '欢迎',
    openMask: true,

  }

  componentDidMount() {
    this.scrollTimer = setInterval(() => {
      if (document.documentElement.scrollTop > 150) {
        this.setState({
          welcomeContent: 'Kavelaa'
        })
      } else {
        this.setState({
          welcomeContent: '欢迎'
        })
      }
    }, 250)
    this.maskTimer = setTimeout(() => {
      this.setState({
        openMask: false
      })
    }, 2000)
  }

  render() {
    return (
      <>
        <Mask
          transitionClass="fade"
          openMask={this.state.openMask}
          timeout={1000}
        >
          <h1>这是蒙层</h1>
        </Mask>
        <Header mode="fixed" pulldownClass="pulldown">
          <Nav userClass="firstBigger">
            <h1>{this.state.welcomeContent}</h1>
            <h1>
              <a href="https://blog.kavelaa.work">Blog</a>
            </h1>
          </Nav>
          <Nav>
            <a href="https://github.com/kavelaa">
              <img
                src={
                  this.state.welcomeContent === '欢迎'
                    ? 'github.svg'
                    : 'github-pulldown.svg'
                }
                alt={'my github'}
              />
            </a>
          </Nav>
        </Header>
        <div className="wrapper">
          <Banner
            userClass="banner"
            srcArr={[
              'github.svg',
              'github-pulldown.svg',
              { src: 'index-drizzle.png', url: 'https://drizzle.one' }
            ]}
            duration={5}
            showProgress
            showDots
          />
        </div>
        <ProgressBar width={666} height={16} mode={'progress'} progress={32} />
      </>
    )
  }
}

export default App
