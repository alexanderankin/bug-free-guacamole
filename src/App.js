import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-defaulticon-compatibility';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-geometryutil';
// import icon from 'leaflet-geometryutil';


import logo from './logo.svg';
import './App.css';
import points from './points';
import util from './util';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

var isMarkerInsidePolygon = util.isMarkerInsidePolygon;

class App extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      turfMarkers: null
    };
    this.houses = points;
    console.log(L.drawVersion);
    window.L = L;

    this.mapTriggerFinish = this.mapTriggerFinish.bind(this);
    this.updateGroups = this.updateGroups.bind(this);
  }

  componentDidMount() {
    // var map = L.map('map', { center: [43.00, -79.00], zoom: 10 });
    var map = L.map('map', { center: {lat: 42.886467369115, lng: -78.846173286438}, zoom: 15 });
    this.Lmap = map;
    window.map = map;

    var tileLayerURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    /*var tileLayer = */L.tileLayer(tileLayerURL).addTo(map);
    // var tileLayer = L.tileLayer(tileLayerURL)//.addTo(map);
    var drawnItems = L.featureGroup().addTo(map);
    var houses = L.featureGroup().addTo(map);
    console.log(this.houses.length);

    var format = function(house) {
      return (house.lat + '').substring(0, 8) + ', ' + (house.lng + '').substring(0, 8)
    };

    // check these vs window.drawnItems;
    window.houseMarkers = [];
    this.houses.forEach(house => {
      var marker = new L.marker(house, {/* icon: new icon() */});
      marker.isMarker = true;
      marker.addTo(houses);
      marker.bindPopup("Location: " + format(house));
      window.houseMarkers.push(marker);
    })
    // var drawnItems = L.featureGroup()//.addTo(map);

    // L.control.layers({
    //     // 'osm': osm.addTo(map),
    //     // "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', { attribution: 'google' })
    //     "tiles": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    // }, { 'drawlayer': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map);

    map.addControl(new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        poly: { allowIntersection: false },
      },
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true
        },
        rectangle: true,
        circle: false,
        marker: false,
        circlemarker: false
      }
    }));

    map.on(L.Draw.Event.DRAWSTOP, function (event) {
      // remove listener
      console.log("removing listener");
    });
    map.on(L.Draw.Event.DRAWSTART, function (event) {
      // add listener to trigger the event on the map
      var target = event.target;
      document.addEventListener("keydown", function (ev) {
        if (ev.key.toLowerCase() === 'enter') {
          // target.completeShape();
          console.log(target);
        }
      });
    });

    map.on(L.Draw.Event.DELETED, function (event) {
      console.log("DELETED - need to update output lists");
    });
    map.on(L.Draw.Event.CREATED, function (event) {
      console.log("its happening");
      var layer = event.layer;
      layer.isTurf = true;
      // window.layer = layer; // get shape?
      drawnItems.addLayer(layer);
      window.drawnItems = drawnItems; // get shape?
      console.log('getLatLngs for drawnItems', drawnItems.getLayers().map((l) => l.getLatLngs()));
    });

    this.map = map;

    window.t = function() { this.updateGroups(); }.bind(this);
    window.t();
  }

  updateGroups() {
    var matches = 0;
    // console.log()
    window.map = this.map;
    var turfs = [];
    var turfMarkers = []; 
    this.map.eachLayer(l => { if (l.isTurf) { turfs.push(l); turfMarkers.push([]); }});
    var markers = [];
    this.map.eachLayer(l => { if (l.isMarker) { markers.push(l); }});


    for (var marker_i = 0; marker_i < markers.length; marker_i++) {
      var marker = markers[marker_i];
      for (var turf_i = 0; turf_i < turfs.length; turf_i++) {
        var turf = turfs[turf_i];

        if (isMarkerInsidePolygon(marker, turf)) {
          console.log("got a match: marker", marker_i, marker, "turf", turf_i, turf);
          turfMarkers[turf_i].push(marker_i);
          matches++;
        } else { console.log("no match"); }
      }
    }
    console.log("matches", matches);
    console.log("turfMarkers", turfMarkers);
    this.markers = markers;
    this.setState({ turfMarkers });
  }

  mapTriggerFinish() {
    // this.Lmap;
  }

  render() {
     return (
      <div className="App">
        <header className="App-header" style={{ minHeight: '20vh', height: '20vh', overflow: 'hidden' }}>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
            Learn React
          </p>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div id="map" style={{ height: 400, width: '100%' }}></div>
            </div>
            <div className="col-md-6" style={{ border: '2px solid grey', borderRadius: 10, backgroundColor: 'lightgrey' }}>

              {this.state.turfMarkers ? this.state.turfMarkers.map((markers, i) => {
                {/*style={{width: '18rem'}}*/}
                return <div key={i} className="card" >
                  <div className="card-body">
                    <h5 className="card-title">Turf No {i}</h5>
                    <p className="card-text">Quick sample text.</p>
                    <ul>
                      {markers.map(marker_i => {
                        var pt = this.markers[marker_i].getLatLng();
                        pt.lat = (pt.lat + '').substring(0, 10);
                        pt.lng = (pt.lng + '').substring(0, 10);
                        return <li><code>{JSON.stringify(pt)}</code></li>
                      })}
                    </ul>
                    {/*<a href="#" className="btn btn-primary">Go somewhere</a>*/}
                  </div>
                </div>
              }) : <p>THere are no state turfMarkers</p>}

            </div>
            <div className="row">
              <p>TOTAL Houses</p>
              <ul>
                {this.houses.map((house) => {
                  return <li key={house.lng + ' ' + house.lat}>
                    <code>{JSON.stringify(house)}</code>
                  </li>;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
     );
   }
}

export default App;
