import React from 'react'
import { connect } from 'react-redux'
import Colour from './Colour'
// import { getGamesData } from '../../actions'

import Pen from '../Pen'

class Colours extends React.Component {
  renderColour (colours, frames) {
    return (
      colours.map(colour =>
        <Colour key={`rgb(${colour.r},${colour.g},${colour.b})`} colour={colour} frames={frames} />
      )
    )
  }

  componentDidMount () {
    // return getGamesData(1)
  }
  render () {
    const { colours, frames } = this.props
    return (
      <div className = "left">
        <h2> Colours </h2>
        {this.renderColour(colours, frames)}
        <Pen />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    colours: state.coloursReducer.colours,
    frames: state.framesReducer
  }
}

export default connect(mapStateToProps)(Colours)
