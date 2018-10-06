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
        <Switch>
          <Route path='/' component={Home} />
        </Switch>
      </HashRouter>
    );
  }
}


export default App;
