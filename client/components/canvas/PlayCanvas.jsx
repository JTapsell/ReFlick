import React from 'react'
import { connect } from 'react-redux'

import { getGameData } from '../../api/games'

class PlayCanvas extends React.Component {
  state = {
    currentFrame: 1,
    colours: this.props.colours
  }

  componentDidMount () {
    getGameData(24)
      .then(game => {
        const frameIndices = [1, 2, 3, 4]
        frameIndices.forEach(i => {
          const clampedArray = Uint8ClampedArray.from(game[`frame${i}Img`].data)
          const imageData = new ImageData(clampedArray, 500, 500)
          this.setState({
            [`frame${i}Img`]: imageData,
            [`frame${i}Map`]: JSON.parse(game[`frame${i}Map`])
          })
        })
        const context = this.refs.playcanvas.getContext('2d')
        context.putImageData(this.state.frame1Img, 0, 0)
      })
  }

  displayActiveFrame = () => {
    const context = this.refs.playcanvas.getContext('2d')
    const frameImg = this.state[`frame${this.state.currentFrame}Img`]
    context.putImageData(frameImg, 0, 0)
  }

  clickHandler = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    const context = this.refs.playcanvas.getContext('2d')
    const pixelClicked = Array.from(context.getImageData(offsetX, offsetY, 1, 1).data)

    const coloursArray = this.state.colours.map(colourObj => {
      const { r, g, b, a } = colourObj
      return [ r, g, b, a ]
    })

    const checkPixelColour = (pixelClicked) => {
      coloursArray.forEach((colour, i) => {
        if (JSON.stringify(pixelClicked) === JSON.stringify(colour)) {
          const colourId = this.state.colours[i].id
          const frameMap = this.state[`frame${this.state.currentFrame}Map`]
          const frameToSwitchTo = frameMap[`col${colourId}`]
          if (frameToSwitchTo) {
            this.setState({
              currentFrame: frameToSwitchTo
            }, this.displayActiveFrame)
          }
        }
      })
    }
    checkPixelColour(pixelClicked)
  }

  render () {
    return (
      <div id ="playcanvas">
        <canvas
          onClick={this.clickHandler}
          ref="playcanvas"
          width={500}
          height={500}>
        </canvas>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return ({
    colours: state.coloursReducer.colours
  })
}

export default connect(mapStateToProps)(PlayCanvas)
