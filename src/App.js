import React, { useEffect } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

function toRad(Value) {
  return (Value * Math.PI) / 180;
}

function calcCrow(lat1i, lon1, lat2i, lon2) {
  try {
    if (lat1i === null || lon1 === null || lat2i === null || lon2 === null) throw Error;
    var R = 6371; // km
    var dLat = toRad(lat2i - lat1i);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1i);
    var lat2 = toRad(lat2i);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d * 100) / 100;
  } catch (e) {
    return 0;
  }
}

export default function App() {
  const [myCords, setCords] = React.useState({
    lat: null,
    lng: null,
  });
  const [address, setAddress] = React.useState("");
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null,
  });
  const [suggestionsMy, setSuggestionsMy] = React.useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setCords({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        console.log("error");
      }
    );
  }, []);
  console.log(suggestionsMy);
  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  return (
    <div>
      <div>Distance: {calcCrow(myCords.lat, myCords.lng, coordinates.lat, coordinates.lng)} km</div>
      <div style={{ marginTop: "10px" }}>
        My cords
        <ul>
          <li>Latitude: {myCords.lat}</li>
          <li>Longitude: {myCords.lng}</li>
        </ul>
      </div>
      <PlacesAutocomplete key={"key"} value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          if (suggestions.length) setSuggestionsMy(suggestions);
          return (
            <div>
              Selected cords
              <ul>
                <li>Latitude: {coordinates.lat}</li>
                <li>Longitude: {coordinates.lng}</li>
              </ul>
              <input {...getInputProps({ placeholder: "Type address" })} />
              <div>
                {loading ? <div>...loading</div> : null}

                {suggestionsMy.map(suggestion => {
                  return (
                    <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId} className="hoverDiv">
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
      </PlacesAutocomplete>
    </div>
  );
}
