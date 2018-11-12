import React, { Component } from 'react';
import TweetParser from 'react-tweet-parser';
import moment from 'moment';

export default class Tweet extends Component {
  render () {
    const tweet = this.props.tweet;

    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="card-text">
            {
              tweet.retweeted_status &&
              <span className="card-retweet d-block mb-3 text-monospac">
                <strong>Retweet from</strong><a className="ml-1" href={'https://twitter.com/' + tweet.retweeted_status.user.screen_name} target="blank">{ '@' + tweet.retweeted_status.user.screen_name }</a>
              </span>
            }
            <TweetParser>
              {
                tweet.text.includes('RT @') ?
                tweet.text.substr(tweet.text.indexOf(':') + 1) :
                tweet.text
              }
            </TweetParser>
          </div>
          <p className="card-text"><small className="text-muted">{moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').fromNow()}</small></p>
        </div>
      </div>
    );
  }
}