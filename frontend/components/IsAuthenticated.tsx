import React, { Component } from 'react';

export default class IsAuthenticated extends Component {
  render() {
    return <div>{this.props.children()}</div>;
  }
}
