import React from 'react';
import { connect } from 'react-redux';
import { requestData } from './redux/actions'
import './static/css/style.min.css';
// import { render } from '@testing-library/react';

import BarChart from './components/BarChart';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 id="title">Times in cycle races</h1>
        </header>
        <article>
          <BarChart id="1"/>
          <p id="legend">This shows times in cycle races throughout the years.</p>
        </article>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  requestData: () => dispatch(requestData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
