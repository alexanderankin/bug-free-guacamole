

function isMarkerInsidePolygon(marker, poly) {
  if (!poly) {
    console.log("checking isMarkerInsidePolygon empty polygon");
    return false;
  }

  if (poly.getLatLngs().length !== 1) {
    console.log("checking isMarkerInsidePolygon on multiple features");
    return false;
  }

  var polyPoints = poly.getLatLngs()[0];
  var x = marker.getLatLng().lat, y = marker.getLatLng().lng;

  // console.log("looking for", x, y, "in polyPoints", polyPoints);

  var inside = false;
  for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
    var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

    var intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

module.exports = {
  isMarkerInsidePolygon
};
