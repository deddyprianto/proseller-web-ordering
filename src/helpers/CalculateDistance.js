module.exports = {
  StraightDistance: (from, to, coordinate) => {
    const {longitude, latitude} = coordinate;
    let lat1 = Number(from.latitude || latitude);
    let lon1 = Number(from.longitude || longitude);
    let lat2 = Number(to.latitude || to.lat);
    let lon2 = Number(to.longitude || to.lng);

    let R = 6371e3; // metres
    let rarians1 = (lat1 * Math.PI) / 180;
    let radians2 = (lat2 * Math.PI) / 180;
    let sudut1 = ((lat2 - lat1) * Math.PI) / 180;
    let sudut2 = ((lon2 - lon1) * Math.PI) / 180;

    let a =
        Math.sin(sudut1 / 2) * Math.sin(sudut1 / 2) +
        Math.cos(rarians1) *
            Math.cos(radians2) *
            Math.sin(sudut2 / 2) *
            Math.sin(sudut2 / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return ((R * c) / 1000).toFixed(2); // KM
  }
};
  
  