import { FunctionComponent } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

type GoogleMapWrapperProps = {
  mapHeight?: number;
  mapWidth?: any;
  LatLng?: any;
  MarketArrays?: any;
};

const OSMapWrapper: FunctionComponent<GoogleMapWrapperProps> = ({
  mapHeight = 300,
  mapWidth = "100%",
  LatLng = [51.505, -0.09],
  MarketArrays = dummy,
}) => {
  const position: LatLngExpression = LatLng;

  return (
    <>
      <div>
        <MapContainer
          style={{ height: mapHeight, borderRadius: 50, width: mapWidth }}
          center={position}
          zoom={10}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {MarketArrays.map((item: any) => (
            <Marker position={item.position}>
              <Popup>{item.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

const dummy: any = [
  {
    position: [51.505, -0.09],
    name: "A pretty CSS3 popup. <br> Easily customizable.",
  },
  {
    position: [51.51, -0.1],
    name: "Another pretty CSS3 popup. <br> Easily customizable.",
  },
];

export default OSMapWrapper;
