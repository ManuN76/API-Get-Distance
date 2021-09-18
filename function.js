async function distance(origin, dest, sys, travel) {
  let unit = google.maps.UnitSystem.IMPERIAL;
  if (sys.toLowerCase() == "metric") {
    unit = google.maps.UnitSystem.METRIC;
  }

  let mode = "DRIVING";
  if (travel != "") mode = travel.toUpperCase();

  return new Promise((resolve, reject) => {
    let response;
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [dest],
        travelMode: [mode],
        unitSystem: [unit],
        avoidHighways: false,
        avoidTolls: false,
      },
      function (resp, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          response = reject(status);
        } else {
          response = resolve(resp);
        }
      }
    );
    return response;
  });
}

let cache = new Map();

window.function = async function (origin, destination, unit, mode) {
  origin = origin.value ?? "";
  destination = destination.value ?? "";
  unit = unit.value ?? "";
  mode = mode.value ?? "";

  if (origin.trim() == "" || destination.trim() == "") return;

  let cacheKey = origin + destination + unit + mode;

  let ret = cache.get(cacheKey);

  if (ret == undefined) {
    let serv = await distance(origin, destination, unit, mode);

    ret =
      serv.rows[0].elements[0].distance.text +
      "," +
      serv.rows[0].elements[0].duration.text;

    cache.set(cacheKey, ret);

    //console.log("API", cacheKey, ret);
  }

  return ret;
};
