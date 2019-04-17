import React, { Component } from 'react';

class Player extends Component {
    constructor() {
        super();
        this.audio = React.createRef();
    }

    render() {
        return (
            <audio ref={this.audio} controls src={this.props.episode.audio}></audio>
        );
    }

    componentDidUpdate() {
        if (this.props.episode && this.audio.current.paused) {
            this.audio.current.play();
        }
    }

    createMediaSession() {
        if ('mediaSession' in navigator) {
            // eslint-disable-next-line no-undef
            navigator.mediaSession.metadata = new MediaMetadata({
                title: this.props.episode.title,
            })
        }
    }
}

export default Player;