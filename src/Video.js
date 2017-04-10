/* global jwplayer */
import React, { Component } from 'react'

export default class VideoPlayer extends Component {
  componentDidMount() {
    jwplayer('my-video').setup({
      file: 'https://www.dropbox.com/s/houxqhxafrvbybd/Balls%20Game.mov?dl=1',
      width: '100%',
    })
  }

  componentWillUnmount() {
    jwplayer('my-video').remove()
  }

  render() {
    return <div style={{ width: 400 }}><div id='my-video' /></div>
  }
}
