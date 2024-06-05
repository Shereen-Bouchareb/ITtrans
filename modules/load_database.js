const stations = [
    { name: 'Station 1', latitude: 40.7128, longitude: -74.0060 },
    { name: 'Station 2', latitude: 34.0522, longitude: -118.2437 }
  ];
  
  // Fonction pour trouver une station par coordonnées
  function findStationByCoordinates(lat, long) {
    return stations.find(station => station.latitude === lat  && station.longitude === long);
  }
  
  module.exports = { findStationByCoordinates };