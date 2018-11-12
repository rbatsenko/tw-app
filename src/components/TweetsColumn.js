import React, { Component } from 'react';
import Tweet from './Tweet';

export default class TweetsColumn extends Component {
  render () {
    return (
      <div className={this.props.activeName !== this.props.name ? 'col-12 col-md-4 d-none d-md-block col-tweets' : 'col-12 col-md-4 d-md-block col-tweets'} data-name={this.props.name}>
        <div className="col-tweets-name-number d-flex justify-content-between mt-4">
          <h5 className="lead">{this.props.name}</h5>
          <input className="form-control tweets-number" type="number" name="tweets-number" data-col-name={this.props.name} min="0" max="30" onChange={this.props.changeTweetsNumber} />
        </div>
        {
          !this.props.error ?
            <div className="cards mt-4">
              {
                this.props.tweets.map((tweet, key) => (
                  <Tweet tweet={tweet} key={key} />
                ))
              }
            </div>
          :
            <div className="alert alert-danger mt-4 mb-2" role="alert">
              {this.props.error} :(
            </div>
        }
      </div>
    );
  }
}