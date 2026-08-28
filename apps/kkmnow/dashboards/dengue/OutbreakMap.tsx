import { useTranslation } from "datagovmy-ui/hooks";
import { useEffect, useState, FunctionComponent } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

type Pt = { position: [number, number]; cases: number; locality: string; district?: string };

interface OutbreakMapProps {
  center: [number, number];
  zoom: number;
  outbreaks: Pt[];
  hotspots: Pt[];
}

const ORANGE = "#f97316"; // active outbreaks
const RED = "#dc2626"; // hotspots
const RING_ZOOM = 12; // show control-radius rings only when zoomed in this far

const Invalidate = () => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

// Control-radius rings, rendered only once the user zooms in (else they blob together).
const Rings: FunctionComponent<{ outbreaks: Pt[]; hotspots: Pt[] }> = ({ outbreaks, hotspots }) => {
  const map = useMap();
  const [z, setZ] = useState(map.getZoom());
  useMapEvents({ zoomend: () => setZ(map.getZoom()) });
  if (z < RING_ZOOM) return null;
  return (
    <>
      {outbreaks.map((p, i) => (
        <Circle key={`oc${i}`} center={p.position} radius={400}
          pathOptions={{ color: ORANGE, weight: 1, fillColor: ORANGE, fillOpacity: 0.08 }} />
      ))}
      {hotspots.map((p, i) => (
        <Circle key={`hc${i}`} center={p.position} radius={200}
          pathOptions={{ color: RED, weight: 1, fillColor: RED, fillOpacity: 0.12 }} />
      ))}
    </>
  );
};

const OutbreakMap: FunctionComponent<OutbreakMapProps> = ({ center, zoom, outbreaks, hotspots }) => {
  const { t } = useTranslation("dashboard-dengue");
  return (
    <div className="relative">
      <MapContainer
        key={`${center[0]},${center[1]},${zoom}`}
        center={center}
        zoom={zoom}
        scrollWheelZoom
        preferCanvas
        className="z-0 h-[600px] w-full rounded-xl"
      >
        <Invalidate />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Rings outbreaks={outbreaks} hotspots={hotspots} />

        {outbreaks.map((p, i) => (
          <CircleMarker key={`om${i}`} center={p.position} radius={4}
            pathOptions={{ color: "#fff", weight: 0.5, fillColor: ORANGE, fillOpacity: 0.9 }}>
            <Popup>
              <b>{p.locality}</b>
              <br />
              {p.district}
              <br />
              {p.cases} {t("cases")} · {t("legend_outbreaks")}
            </Popup>
          </CircleMarker>
        ))}
        {hotspots.map((p, i) => (
          <CircleMarker key={`hm${i}`} center={p.position} radius={4}
            pathOptions={{ color: "#fff", weight: 0.5, fillColor: RED, fillOpacity: 0.9 }}>
            <Popup>
              <b>{p.locality}</b>
              <br />
              {p.cases} {t("cases")} · {t("legend_hotspots")}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="border-outline dark:border-washed-dark absolute right-3 top-3 z-[1000] flex flex-col gap-1 rounded-lg border bg-white/90 p-2 text-xs shadow dark:bg-black/80">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: ORANGE }} />
          {t("legend_outbreaks")} ({outbreaks.length})
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: RED }} />
          {t("legend_hotspots")} ({hotspots.length})
        </div>
        <p className="text-dim pt-1">{t("zoom_hint")}</p>
      </div>
    </div>
  );
};

export default OutbreakMap;
