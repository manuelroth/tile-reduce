"use strict";

var VectorTile = require("@mapbox/vector-tile").VectorTile;
var Pbf = require("pbf");

module.exports = parseData;

function parseData(data, tile, source) {
  var raw = new VectorTile(new Pbf(data));
  if (source.data) {
    return data;
  } else if (source.tile) {
    return raw;
  } else if (source.raw) {
    return raw.layers;
  } else {
    return toGeoJSON(raw.layers, tile, source);
  }
}

function toGeoJSON(layers, tile, source) {
  var collections = {};

  for (var layerId in layers) {
    if (source.layers && source.layers.indexOf(layerId) === -1) continue;

    collections[layerId] = {
      type: "FeatureCollection",
      features: []
    };
    for (var k = 0; k < layers[layerId].length; k++) {
      collections[layerId].features.push(
        layers[layerId].feature(k).toGeoJSON(tile[0], tile[1], tile[2])
      );
    }
  }
  return collections;
}
