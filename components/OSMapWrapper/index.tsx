import { FunctionComponent } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

type GoogleMapWrapperProps = {
  apiKey?: string;
  map?: JSX.Element;
  LatLng?: any;
};

const OSMapWrapper: FunctionComponent<GoogleMapWrapperProps> = ({
  apiKey,
  map,
  LatLng = [51.505, -0.09],
}) => {
  const position: LatLngExpression = LatLng;

  return (
    <>
      <div>
        <MapContainer
          style={{ height: 300, borderRadius: 50, width: "100%" }}
          center={position}
          zoom={5}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
};

export default OSMapWrapper;
