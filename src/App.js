import React, { Component } from "react";
import Podcast from './Podcast';
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: '',
            typingUrl: ''
        };
    }

    handleChange = (e) => {
        this.setState({
            ...this.state,
            typingUrl: e.target.value
        });
    }

    keyPress = (e) => {
        if (e.keyCode === 13) { // enter
            this.setState({
                ...this.state,
                url: this.state.typingUrl
            });
        }
    }

    render() {
        return (
            <div className="App">
                <input
                    type="text"
                    placeholder="Podcast URL"
                    value={this.state.typingUrl}
                    onChange={this.handleChange}
                    onKeyDown={this.keyPress} />
                <Podcast url={this.state.url} />
            </div>
        );
    }
}

export default App;
