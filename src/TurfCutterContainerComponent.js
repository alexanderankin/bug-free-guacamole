import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TurfCutter from './TurfCutter';
import points from './newpoints';

import EditableContainer from './Editable/container';

function openThisPopup() {
  this.openPopup();
}

class TurfCutterContainerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      turfPoints: [],
      markersHidden: false
    };
    this.toggleMarkerVis = this.toggleMarkerVis.bind(this);
  }

  toggleMarkerVis() {
    var newDisplay = this.state.markersHidden ? '' : 'none';
    this.pointers.mapInstance.getPane('pointMarkers').style.display = newDisplay;
    this.setState({ markersHidden: !this.state.markersHidden });
  }

  render() {
    window.turfPoints = this.state.turfPoints;
    return (
      <div className="container">
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="card bg-light">
              <div className="card-header">Controls</div>
              <div className="card-body">
                <button type="button" onClick={this.toggleMarkerVis} className="btn btn-primary btn-sm" data-toggle="button" aria-pressed="false" autoComplete="off">
                  {this.state.markersHidden ? 'Show Markers' : 'Hide Markers'}
                </button>
                <div className="form-inline-group">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value={this.state.doHover} onChange={() => {
                        this.pointers.housesFeatureGroup.eachLayer(l => {
                          if (this.state.doHover) {
                            l.off('mouseover', openThisPopup);
                          } else {
                            l.on('mouseover', openThisPopup);
                          }
                        });
                        this.setState({ doHover: !this.state.doHover });
                      }}/> Show Hover Information
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TurfCutter
              points={points}
              turfCallback={(turfPoints) => this.setState({ turfPoints })}
              cDMCallback={(pointers) => { this.pointers = pointers; }}
              />
            </div>
          <div className="col-md-6">
            <TurfCutterPointShower tp={this.state.turfPoints} />
          </div>
        </div>
      </div>
    );
  }
}

export default TurfCutterContainerComponent;

class TurfCutterPointShower extends Component {
  static propTypes = {
    tp: PropTypes.array.isRequired
  };
  render() {
    var names = {};
    return (
      <div className="card bg-light">
        <div className="card-header">Turfs</div>
        <div className="card-body">
          <button type="button" className="btn btn-info mb-3">Save</button>
          {this.props.tp.map((turf, i) => {
            names[i] = 'Turf No ' + (i + 1);
            return <div key={i} className="card bg-light">
              <div className="card-header"
                onMouseOver={(e) => e.target.style.fontWeight = 'bold'}
                onMouseOut={(e) => e.target.style.fontWeight = ''}
                >
                Turf No {i + 1}
              </div>
              <div className="card-body">
                <EditableContainer
                  defaultValue={names[i]}
                  save={(name) => {
                    names[i] = name;
                    (document.querySelector('#TurfCutterPointShower' + i) || {}).innerText = name;
                  }}>
                  <h4 id={'TurfCutterPointShower' + i} className="card-title">{names[i]}</h4>
                </EditableContainer>
                <p className="card-text">{turf.length} Houses</p>
                <button type="button" className="btn btn-link btn-sm d-inline-block" onClick={(e) => {
                  window.$(e.target).parent().find('table').toggleClass('d-none');
                }}>Show/Hide List</button>
                <table className="table table-inverse d-none">
                  <thead>
                    <tr>
                      <th>House ID</th>
                      <th>House Number</th>
                      <th>lon</th>
                      <th>lat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turf.map((house, i) => {
                      return <tr key={i}>
                        <td>{house.m_id}</td>
                        <td>{house.m_no}</td>
                        <td>{(house.ops.house.coords.lng + '').substring(0, 8)}</td>
                        <td>{(house.ops.house.coords.lat + '').substring(0, 8)}</td>
                      </tr>;
                    })}
                  </tbody>
                </table>
              </div>
            </div>;
          })}
        </div>
      </div>
    );
  }
}
