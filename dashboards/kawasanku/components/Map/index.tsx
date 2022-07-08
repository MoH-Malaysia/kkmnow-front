import { useRef, useEffect } from "react";

interface MapProps extends google.maps.MapOptions {
  geojson: any;
}

const Map: React.FC<MapProps> = ({ geojson }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const map = new google.maps.Map(ref.current, {
        zoom: 0,
        disableDefaultUI: true,
      });

      // LOAD GEOJSON
      map.data.addGeoJson(geojson);

      // SET GEOJSON STYLE
      map.data.setStyle({
        fillColor: "#ffffff",
        fillOpacity: 0.25,
        strokeColor: "#13293d",
        strokeWeight: 1,
      });

      // FIT MAP TO GEOJSON BOUNDS
      let bounds = new google.maps.LatLngBounds();
      map.data.forEach(feature => {
        feature.getGeometry()?.forEachLatLng(latLng => {
          // -20 only for /geo/area=mys to fit both peninsulas
          bounds?.extend(new google.maps.LatLng(latLng.lat(), latLng.lng() - 20));
        });
      });

      // 75 padding only for /geo/area=mys to fit both peninsulas
      map.fitBounds(bounds, 75);
    }
  }, [geojson]);

  return <div className="absolute top-0 left-0 -z-10 flex h-full w-full" ref={ref} />;
};

export default Map;
