import React, { Component } from "react";
import Episode from './Episode';
import Player from './Player';

class Podcast extends Component {
    constructor() {
        super();
        this.state = {
            podcast: null,
            episodes: [],
            currentEpisode: '',
            url: ''
        };
    }

    componentDidUpdate() {
        if (this.props.url !== this.state.url) {
            this.setState({
                ...this.state,
                url: this.props.url,
                podcast: null,
                episodes: [],
                currentEpisode: ''
            });

            this.loadXML(this.props.url).then(data =>
                this.setState({
                    ...this.state,
                    podcast: data[0],
                    episodes: data[1],
                })
            );
        }
    }

    parseXML(xml) {
        const parser = new DOMParser();
        const xmlOM = parser.parseFromString(xml, "application/xml");
        return xmlOM;
    }

    getXMLContent(node, tag) {
        return node.getElementsByTagName(tag)[0].innerHTML || "";
    }

    getXMLAttribute(node, tag, attr) {
        const el = node.getElementsByTagName(tag);
        if (el.length > 0) {
            return el[0].getAttribute(attr);
        }

        return "";
    }

    parseEpisode(node) {
        const audio = this.getXMLAttribute(node, "enclosure", "url");
        console.log(node);

        if (audio) {
            return {
                title: this.getXMLContent(node, "title"),
                published: this.getXMLContent(node, "pubDate"),
                audio,
                image: this.getXMLAttribute(node, "itunes:image", "href"),
                duration: this.getXMLContent(node, "itunes:duration")
            };
        }

        return null;
    }

    getEpisodes(xmlOM) {
        const rss = xmlOM.documentElement;
        const episodes = [];

        if (
            rss.nodeName === "rss" &&
            rss.children[0].nodeName === "channel" &&
            rss.children[0].children.length > 0
        ) {
            const episodeNodes = rss.children[0].children;
            for (const epNode of episodeNodes) {
                if (epNode.nodeName === "item") {
                    const ep = this.parseEpisode(epNode);
                    if (ep) {
                        episodes.push(ep);
                    }
                }
            }
        }

        return episodes;
    }

    getPodcastInfo(xmlOM) {
        const rss = xmlOM.documentElement;
        let info = {};

        if (
            rss.nodeName === "rss" &&
            rss.children[0].nodeName === "channel" &&
            rss.children[0].children.length > 0
        ) {
            const channel = rss.children[0];
            info = {
                title: this.getXMLContent(channel, "title"),
                author: this.getXMLContent(channel, "itunes:author")
            }
        }

        return info;
    }

    async loadXML(url) {
        const res = await fetch(url);
        const xml = await res.text();
        const parsed = this.parseXML(xml);
        const episodes = this.getEpisodes(parsed);
        const info = this.getPodcastInfo(parsed);
        return [info, episodes];
    }

    renderEpisodeList() {
        const list = [];
        let i = 0;

        for (const episode of this.state.episodes) {
            list.push(<Episode key={i} episode={episode} play={this.play.bind(this)} />);
            i++;
        }

        return list;
    }

    play(episode) {
        this.setState({
            ...this.state,
            currentEpisode: episode
        });
    }

    render() {
        if (this.state.podcast) {
            return (
                <div className="podcast">
                    <p>{ this.state.podcast.title }</p>
                    <p>{ this.state.currentEpisode.title }</p>
                    <Player episode={this.state.currentEpisode} />
                    <section className="episodes">
                        {this.renderEpisodeList()}
                    </section>
                </div>
            );
        }

        return null;
    }
}

export default Podcast;