import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home.jsx';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <HashRouter>
        <CookiesProvider>
            <Switch>
              <Route path='/' component={Home} />
            </Switch>
        </CookiesProvider>
      </HashRouter>
    );
  }
}


export default App;
