import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TurfCutter from './TurfCutter';
import points from './newpoints';

class TurfCutterContainerComponent extends Component {
  // static propTypes = {
  //   className: PropTypes.string,
  // };

  constructor(props) {
    super(props);

    this.state = {
      turfPoints: null
    };
  }

  render() {
    window.turfPoints = this.state.turfPoints;
    return (
      <div>
      <TurfCutter
        points={points}
        turfCallback={(turfPoints) => this.setState({ turfPoints })}
        />
      <p>{this.state.turfPoints ? 'Have turfPoints' : 'No turfPoints yet'}</p>
      </div>
    );
  }
}

export default TurfCutterContainerComponent;
