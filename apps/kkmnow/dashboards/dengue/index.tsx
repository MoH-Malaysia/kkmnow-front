import { routes } from "@lib/routes";
import {
  Hero,
  Container,
  Section,
  Slider,
  StateDropdown,
  AgencyBadge,
  Dropdown,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const OutbreakMap = dynamic(() => import("./OutbreakMap"), { ssr: false });

type Pt = { position: [number, number]; cases: number; locality: string; district?: string };

interface DengueProps {
  last_updated: string;
  next_update: string;
  params: { state: string };
  keystats: {
    cases_ytd: number;
    cases_last7: number;
    incidence_ytd: number | null;
    outbreaks: number;
    hotspots: number;
    year: number;
  };
  timeseries: {
    data_as_of: string;
    data: { x: number[]; overall: number[]; by_district: Record<string, number[]> };
  };
  districts: string[];
  map: {
    data_as_of: string;
    center: [number, number];
    zoom: number;
    outbreaks: Pt[];
    hotspots: Pt[];
  };
}

const DengueDashboard: FunctionComponent<DengueProps> = ({
  last_updated,
  next_update,
  params,
  keystats,
  timeseries,
  districts,
  map,
}) => {
  const { t } = useTranslation(["dashboard-dengue", "common"]);
  const N = timeseries.data.x.length;
  const DEFAULT_FROM = Math.max(0, N - 180);
  const districtOptions = [
    { label: t("all_districts"), value: "all" },
    ...districts.map(d => ({ label: d, value: d })),
  ];
  const { data, setData } = useData({
    minmax: [DEFAULT_FROM, N - 1],
    district_opt: districtOptions[0],
  });

  const districtValue: string = data.district_opt?.value ?? "all";
  const series =
    districtValue === "all"
      ? timeseries.data.overall
      : timeseries.data.by_district[districtValue] ?? [];
  const [lo, hi] = data.minmax;
  const x = timeseries.data.x.slice(lo, hi + 1);
  const y = series.slice(lo, hi + 1);
  const stateName = CountryAndStates[params.state];
  const scope = districtValue === "all" ? stateName : `${districtValue}, ${stateName}`;

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.healthcare"), "text-danger"]}
        header={[t("header")]}
        description={[t("description"), "dark:text-outline text-dim"]}
        action={<StateDropdown url={routes.DENGUE} currentState={params.state} width="w-max" />}
        last_updated={last_updated}
        next_update={next_update}
        agencyBadge={<AgencyBadge agency="moh" />}
      />

      <Container className="min-h-screen">
        {/* Daily cases — with district dropdown on state pages */}
        <Section
          title={t("timeseries_header", { scope })}
          description={t("timeseries_desc")}
          date={timeseries.data_as_of}
          menu={
            districts.length > 0 ? (
              <Dropdown
                anchor="left"
                width="w-full lg:w-64"
                options={districtOptions}
                selected={data.district_opt}
                onChange={(o: any) => setData("district_opt", o)}
              />
            ) : undefined
          }
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  id="dengue-daily"
                  className="h-[350px]"
                  enableAnimation={!play}
                  interval="day"
                  data={{
                    labels: x,
                    datasets: [
                      {
                        type: "line",
                        label: t("cases"),
                        data: y,
                        borderColor: AKSARA_COLOR.DANGER,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
                        borderWidth: 1.5,
                        fill: true,
                        pointRadius: 0,
                      },
                    ],
                  }}
                />
                <Slider
                  type="range"
                  period="day"
                  value={data.minmax}
                  data={timeseries.data.x}
                  onChange={(e: any) => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        {/* THE map: iDengue outbreaks + hotspots */}
        <Section title={t("map_header", { state: stateName })} description={t("map_desc")}>
          <OutbreakMap
            center={map.center}
            zoom={map.zoom}
            outbreaks={map.outbreaks}
            hotspots={map.hotspots}
          />
        </Section>
      </Container>
    </>
  );
};

export default DengueDashboard;
