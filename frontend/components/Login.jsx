import React, { Component, Fragment } from 'react';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';

export default class Login extends Component {
  render() {
    return (
      <Fragment>
        <DatePicker />
      </Fragment>
    );
  }
}
