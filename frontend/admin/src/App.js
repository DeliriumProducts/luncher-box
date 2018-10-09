import React, { Component } from 'react';
import Admin from './components/Admin/Admin.jsx';
import { HashRouter, Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
            <Route path='/' component={Admin}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
