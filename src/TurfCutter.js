import React, { Component } from 'react';
import PropTypes from 'prop-types';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-defaulticon-compatibility';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import util from './util';
var isMarkerInsidePolygon = util.isMarkerInsidePolygon;


class TurfCutter extends Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      coords: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired
      }).isRequired,
      name: PropTypes.string,
      address: PropTypes.string
    })).isRequired,
    turfCallback: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.updateTurfPoints = this.updateTurfPoints.bind(this);
  }

  componentDidMount() {
    var center = { lat: 42.886467369115, lng: -78.846173286438 };

    // mapInstance
    var map = L.map('map', { center, zoom: 15 });
    
    // pointMarkers
    map.createPane('pointMarkers');

    // hack(s)
    window.mymap = map;
    this.map = map;

    var tileLayerURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(tileLayerURL).addTo(map);
    var drawnItems = L.featureGroup().addTo(map);

    // house featureGroup
    var houses = L.featureGroup().addTo(map);

    var formatPopUpPoint = point => "Point id[" + point.id + "]";

    this.props.points.forEach(house => {
      var marker = new L.marker(house.coords, { house, pane: 'pointMarkers' });
      marker.id = 'Point_' + house.id;
      marker.isMarker = true;
      marker.addTo(houses);
      marker.bindPopup(formatPopUpPoint(house));
      // marker.on('mouseover', function() { this.openPopup(); });
    });

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

    // need to also do save (after edit)
    map.on(L.Draw.Event.DELETED, () => { console.log('L.Draw.Event.DELETED'); this.updateTurfPoints(); });

    map.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;
      layer.isTurf = true;
      drawnItems.addLayer(layer);
    });
    map.on(L.Draw.Event.CREATED, () => { console.log('L.Draw.Event.CREATED'); this.updateTurfPoints(); });
    map.on(L.Draw.Event.EDITED, () => { console.log('L.Draw.Event.EDITED'); this.updateTurfPoints(); });

    // pass pointers back up
    this.props.cDMCallback({
      mapInstance: map,
      housesFeatureGroup: houses
    });

    // figure out complete with enter w/ L.Draw.Event.{DRAWSTOP,DRAWSTART}
  }

  async updateTurfPoints() {
    var map = this.map;
    window.map = map;
    if (!map)
      return;

    var turfs = [];
    var turfMarkers = []; 
    map.eachLayer(l => { if (l.isTurf) { turfs.push(l); turfMarkers.push([]); }});
    // console.log("found", turfs.length, "turfs");

    var markers = [];
    map.eachLayer(l => { if (l.isMarker) { markers.push(l); }});

    for (var marker_i = 0; marker_i < markers.length; marker_i++) {
      var marker = markers[marker_i];
      for (var turf_i = 0; turf_i < turfs.length; turf_i++) {
        var turf = turfs[turf_i];

        if (isMarkerInsidePolygon(marker, turf)) {
          turfMarkers[turf_i].push({ m_no: marker_i, m_id: marker.id, ops: marker.options });
        }
      }
    }

    this.props.turfCallback(turfMarkers);
    return;
  }

  render() {
    return (
      <div id="map" style={{ height: 400, width: '100%' }}></div>
    );
  }
}

export default TurfCutter;
