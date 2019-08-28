import './App.css';

import React, { Component } from 'react';

import TurfCutterContainerComponent from './TurfCutterContainerComponent';

class App extends Component {
  render() {
    return (
      <div>
        <div className="mb-3"></div>
        <TurfCutterContainerComponent />
      </div>
    );
  }
}

export default App;
