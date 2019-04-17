import React, { Component } from 'react';

class Episode extends Component {
    render() {
        return (
            <article>
                <p className="link" onClick={() => this.props.play(this.props.episode)}>
                    { this.props.episode.title } ({ this.props.episode.duration })
                </p>
            </article>
        );
    }
}

export default Episode;