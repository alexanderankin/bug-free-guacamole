import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import shadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new L.icon({
  iconUrl: icon,
  // shadowUrl: shadow,
  iconRetinaUrl: icon2x,

  // from custom icon docs and https://gis.stackexchange.com/a/223057
  iconSize:     [24, 41],
  iconAnchor:   [12, 41],

  // a little to the left - centering
  // a little more up, match the white dot
  popupAnchor:  [0, -24]
});

L.Marker.prototype.options.icon = DefaultIcon;
