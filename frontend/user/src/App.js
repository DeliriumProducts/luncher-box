import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Switch>
            <Route path='/' component={Home} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}


export default App;
