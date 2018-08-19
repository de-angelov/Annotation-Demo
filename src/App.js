import React, { Component } from 'react';
import ItemContainer from './components/item-container/item-container';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <ItemContainer />
      </div>
    );
  }
}

export default App;
