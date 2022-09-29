import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  Checkbox,
  Tooltip,
  Section,
  Slider,
  StateDropdown,
  Dropdown,
  Button,
} from "@components/index";
import { useData } from "@hooks/useData";
import {
  BLOOD_SUPPLY_COLOR,
  BLOOD_DONATION_COLOR,
  BLOOD_COLOR,
  GRAYBAR_COLOR,
  CountryAndStates,
} from "@lib/constants";
import { BLOOD_SUPPLY_SCHEMA, BLOOD_DONATION_SCHEMA } from "@lib/schema/blood-donation";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useState, useEffect, useMemo } from "react";
import { ArrowPathIcon, MapPinIcon } from "@heroicons/react/24/solid";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Empty = dynamic(() => import("@components/Chart/Empty"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const OSMapWrapper = dynamic(() => import("@components/OSMapWrapper"), { ssr: false });

interface BloodDonationDashboardProps {
  timeseries_all: any;
  timeseries_bloodstock: any;
  timeseries_facility: any;
  heatmap_bloodstock: any;
  heatmap_donorrate: any;
  heatmap_retention: any;
  barchart_age: any;
  barchart_time: any;
  map_facility: any;
}

const BloodDonationDashboard: FunctionComponent<BloodDonationDashboardProps> = ({
  timeseries_all,
  timeseries_bloodstock,
  timeseries_facility,
  heatmap_bloodstock,
  heatmap_donorrate,
  heatmap_retention,
  barchart_age,
  barchart_time,
  map_facility,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const [limit, setLimit] = useState([0, timeseries_all.x.length - 1] as [number, number]);
  const { data, setData } = useData({
    absolute_donation_type: false,
    absolute_blood_group: false,
    absolute_donor_type: false,
    absolute_location: false,
    zoom_state: currentState === "mys" ? undefined : currentState,
    zoom_facility: undefined,
  });

  const filterTimeline = () => {
    return {
      x: timeseries_all.x.slice(limit[0], limit[1]),
      daily: timeseries_all.daily.slice(limit[0], limit[1]),
      line_daily: timeseries_all.line_daily.slice(limit[0], limit[1]),
      apheresis: timeseries_all.apheresis_abs.slice(limit[0], limit[1]),
      apheresis_rel: timeseries_all.apheresis_pct.slice(limit[0], limit[1]),
      wholeblood: timeseries_all.wholeblood_abs.slice(limit[0], limit[1]),
      wholeblood_rel: timeseries_all.wholeblood_pct.slice(limit[0], limit[1]),
      o: timeseries_all.blood_o_abs.slice(limit[0], limit[1]),
      o_rel: timeseries_all.blood_o_pct.slice(limit[0], limit[1]),
      a: timeseries_all.blood_a_abs.slice(limit[0], limit[1]),
      a_rel: timeseries_all.blood_a_pct.slice(limit[0], limit[1]),
      b: timeseries_all.blood_b_abs.slice(limit[0], limit[1]),
      b_rel: timeseries_all.blood_b_pct.slice(limit[0], limit[1]),
      ab: timeseries_all.blood_ab_abs.slice(limit[0], limit[1]),
      ab_rel: timeseries_all.blood_ab_pct.slice(limit[0], limit[1]),
      newdon: timeseries_all.donor_new_abs.slice(limit[0], limit[1]),
      newdon_rel: timeseries_all.donor_new_pct.slice(limit[0], limit[1]),
      recurdon: timeseries_all.donor_recurring_abs.slice(limit[0], limit[1]),
      recurdon_rel: timeseries_all.donor_recurring_pct.slice(limit[0], limit[1]),
      center: timeseries_all.location_centre_abs.slice(limit[0], limit[1]),
      center_rel: timeseries_all.location_centre_pct.slice(limit[0], limit[1]),
      outreach: timeseries_all.location_mobile_abs.slice(limit[0], limit[1]),
      outreach_rel: timeseries_all.location_mobile_pct.slice(limit[0], limit[1]),
    };
  };

  const filtered_timeline = useCallback(filterTimeline, [limit, timeseries_all]);
  const interval_scale = useMemo(
    () => (filtered_timeline().x.length > 365 ? "month" : "day"),
    [filtered_timeline().x]
  );

  const handleClearSelection = () => {
    setData("zoom_state", undefined);
    setData("zoom_facility", undefined);
  };

  return (
    <>
      <Hero background="hero-light-1">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">health</span>
          <h3 className="text-black">Blood Donation</h3>
          <p className="text-dim">
            A stable and high supply of blood is critical for a well-functioning public healthcare
            system. This dashboard, which gives you near real-time updates on key indicators related
            to blood transfusion services, is brought to you by the{" "}
            <a href="#" className="font-semibold text-blue-600">
              National Blood Centre (PDN).
            </a>
          </p>

          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">Zoom into</p>
            <StateDropdown
              url={routes.BLOOD_DONATION}
              currentState={currentState}
              exclude={["pjy", "pls", "lbn", "kvy"]}
            />
          </div>
        </div>
      </Hero>
      <Container className="min-h-screen">
        {/* Is {{ area }}'s current blood supply sufficient? */}
        <Section title="Is Klang Valley's current blood supply sufficient?">
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2 ">
            <Heatmap
              className="h-[420px]"
              title="Blood Supply by States"
              hoverTarget="row"
              data={heatmap_bloodstock}
              axisLeft="state"
              schema={BLOOD_SUPPLY_SCHEMA}
              color={BLOOD_SUPPLY_COLOR}
              //menu={<MenuDropdown />}
            />
            <div>
              <Tabs
                title={
                  <Tooltip
                    trigger={
                      <span className="text-lg font-bold underline decoration-dashed underline-offset-4">
                        Blood supply over time
                      </span>
                    }
                  >
                    Tooltip for Blood supply over time
                  </Tooltip>
                }
                state={currentState}
                //menu={<MenuDropdown />}
              >
                <Panel name="Type A">
                  <Timeseries
                    className="h-[350px] w-full"
                    interval="week"
                    data={{
                      labels: timeseries_bloodstock.x,
                      datasets: [
                        {
                          type: "line",
                          label: "Type A",
                          pointRadius: 0,
                          data: timeseries_bloodstock.type_a,
                          backgroundColor: BLOOD_COLOR[100],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Type B">
                  <Timeseries
                    className="h-[350px] w-full"
                    interval="week"
                    data={{
                      labels: timeseries_bloodstock.x,
                      datasets: [
                        {
                          type: "line",
                          label: "Type B",
                          pointRadius: 0,
                          data: timeseries_bloodstock.type_b,
                          backgroundColor: BLOOD_COLOR[200],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Type AB">
                  <Timeseries
                    className="h-[350px] w-full"
                    interval="week"
                    data={{
                      labels: timeseries_bloodstock.x,
                      datasets: [
                        {
                          type: "line",
                          label: "Type AB",
                          pointRadius: 0,
                          data: timeseries_bloodstock.type_ab,
                          backgroundColor: BLOOD_COLOR[300],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Type O">
                  <Timeseries
                    className="h-[350px] w-full"
                    interval="week"
                    data={{
                      labels: timeseries_bloodstock.x,
                      datasets: [
                        {
                          type: "line",
                          label: "Type O",
                          pointRadius: 0,
                          data: timeseries_bloodstock.type_o,
                          backgroundColor: BLOOD_COLOR[400],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* What are the latest blood donation trends in {{ area }}? */}
        <Section
          title="What are the latest blood donation trends in Klang Valley?"
          description="Blood compromises 3 components - red blood cells, platelets, and plasma. Although
                plasma can be stored for up to 1 year, red blood cells can be only stored for up to 35
                days, and plasma only for up to 5 days. Therefore, it is vital to maintain a high and
                stable level of blood donations; when blood donation activity is low or volatile,
                healthcare services that depend upon blood transfusions may start to come under
                stress."
        >
          <div className="flex w-full flex-col gap-12">
            <div className="space-y-4">
              <Timeseries
                className=" h-[350px] w-full pt-6"
                title="Daily Donations"
                state={currentState}
                interval={interval_scale}
                //menu={<MenuDropdown />}
                round={filtered_timeline().x.length > 1095 ? "week" : "day"}
                stats={null}
                data={{
                  labels: filtered_timeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: "Moving Average (MA)",
                      pointRadius: 0,
                      data: filtered_timeline().line_daily,
                      borderColor: BLOOD_COLOR[500],
                      borderWidth: 1,
                    },
                    {
                      type: "bar",
                      label: "Daily Donation",
                      data: filtered_timeline().daily,
                      backgroundColor: GRAYBAR_COLOR[100],
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Slider
                className="pt-7"
                type="range"
                defaultValue={limit}
                data={timeseries_all.x}
                onChange={(item: any) => setLimit([item.min, item.max])}
              />
              <span className="text-sm text-dim">
                Use this time slider to zoom in specific time range
              </span>
            </div>

            <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
              <Timeseries
                className="h-[250px] w-full"
                state={currentState}
                title="Donation by donation type"
                interval={interval_scale}
                round="day"
                maxY={!data.absolute_donation_type ? 100 : undefined}
                unitY={!data.absolute_donation_type ? "%" : undefined}
                //menu={<MenuDropdown />}
                enableCallout
                subheader={
                  <Checkbox
                    name="donation_type"
                    value={data.absolute_donation_type}
                    onChange={e => setData("absolute_donation_type", e.target.checked)}
                  >
                    Absolute
                  </Checkbox>
                }
                data={{
                  labels: filtered_timeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: "Apherisis",
                      pointRadius: 0,
                      data: !data.absolute_donation_type
                        ? filtered_timeline().apheresis_rel
                        : filtered_timeline().apheresis,
                      backgroundColor: BLOOD_COLOR[300],
                      fill: true,
                      borderWidth: 0,
                    },
                    {
                      type: "line",
                      label: "Whole blood",
                      data: !data.absolute_donation_type
                        ? filtered_timeline().wholeblood_rel
                        : filtered_timeline().wholeblood,
                      backgroundColor: BLOOD_COLOR[100],
                      fill: true,
                      borderWidth: 0,
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Timeseries
                className="h-[250px] w-full"
                title="Donation by blood group (phenotype)"
                state={currentState}
                interval={interval_scale}
                round="day"
                unitY={!data.absolute_blood_group ? "%" : undefined}
                maxY={!data.absolute_blood_group ? 100 : undefined}
                //menu={<MenuDropdown />}
                enableCallout
                subheader={
                  <Checkbox
                    name="blood_group"
                    value={data.absolute_blood_group}
                    onChange={e => setData("absolute_blood_group", e.target.checked)}
                  >
                    Absolute
                  </Checkbox>
                }
                data={{
                  labels: filtered_timeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: "AB",
                      data: !data.absolute_blood_group
                        ? filtered_timeline().ab_rel
                        : filtered_timeline().ab,
                      backgroundColor: BLOOD_COLOR[400],
                      fill: true,
                      borderWidth: 0,
                    },
                    {
                      type: "line",
                      label: "B",
                      data: !data.absolute_blood_group
                        ? filtered_timeline().b_rel
                        : filtered_timeline().b,
                      backgroundColor: BLOOD_COLOR[300],
                      fill: true,
                      borderWidth: 0,
                    },
                    {
                      type: "line",
                      label: "A",
                      data: !data.absolute_blood_group
                        ? filtered_timeline().a_rel
                        : filtered_timeline().a,
                      backgroundColor: BLOOD_COLOR[200],
                      fill: true,
                      borderWidth: 0,
                    },

                    {
                      type: "line",
                      label: "O",
                      data: !data.absolute_blood_group
                        ? filtered_timeline().o_rel
                        : filtered_timeline().o,
                      backgroundColor: BLOOD_COLOR[100],
                      fill: true,
                      borderWidth: 0,
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Timeseries
                className="h-[250px] w-full"
                title="Donation by donor type"
                state={currentState}
                unitY={!data.absolute_donor_type ? "%" : undefined}
                maxY={!data.absolute_donor_type ? 100 : undefined}
                interval={interval_scale}
                round="day"
                //menu={<MenuDropdown />}
                enableCallout
                subheader={
                  <Checkbox
                    name="donor_type"
                    value={data.absolute_donor_type}
                    onChange={e => setData("absolute_donor_type", e.target.checked)}
                  >
                    Absolute
                  </Checkbox>
                }
                data={{
                  labels: filtered_timeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: "Recurring",
                      data: !data.absolute_donor_type
                        ? filtered_timeline().recurdon_rel
                        : filtered_timeline().recurdon,
                      backgroundColor: BLOOD_COLOR[300],
                      fill: true,
                      borderWidth: 0,
                    },
                    {
                      type: "line",
                      label: "New",
                      data: !data.absolute_donor_type
                        ? filtered_timeline().newdon_rel
                        : filtered_timeline().newdon,
                      backgroundColor: BLOOD_COLOR[100],
                      fill: true,
                      borderWidth: 0,
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Timeseries
                className="h-[250px] w-full"
                title="Donation by location"
                state={currentState}
                interval={interval_scale}
                round="day"
                unitY={!data.absolute_location ? "%" : undefined}
                maxY={!data.absolute_location ? 100 : undefined}
                //menu={<MenuDropdown />}
                enableCallout
                subheader={
                  <Checkbox
                    name="location"
                    value={data.absolute_location}
                    onChange={e => setData("absolute_location", e.target.checked)}
                  >
                    Absolute
                  </Checkbox>
                }
                data={{
                  labels: filtered_timeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: "Donation Center",
                      data: !data.absolute_location
                        ? filtered_timeline().center_rel
                        : filtered_timeline().center,
                      backgroundColor: BLOOD_COLOR[300],
                      fill: true,
                      borderWidth: 0,
                    },
                    {
                      type: "line",
                      label: "Outreach",
                      data: !data.absolute_location
                        ? filtered_timeline().outreach_rel
                        : filtered_timeline().outreach,
                      backgroundColor: BLOOD_COLOR[100],
                      fill: true,
                      borderWidth: 0,
                    },
                  ],
                }}
                enableGridX={false}
              />
            </div>
          </div>
        </Section>

        {/* How strong is the new donor recruitment in {{ area }}? */}
        <Section
          title="How strong is the new donor recruitment in Klang Valley?"
          description="Recruitment of new donors is vital to replace donors who reach their golden years and
              stop donating, as well as to support a growing population."
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title="Number of new donors" state={currentState}>
                {/* //menu={<MenuDropdown />}  */}
                <Panel name="Annual">
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.annual.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: barchart_time.annual.y,
                          backgroundColor: GRAYBAR_COLOR[200],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Monthly">
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.monthly.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: barchart_time.monthly.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title="New donors by age group" state={currentState}>
                {/* //menu={<MenuDropdown />} */}
                <Panel name="Past 1 year">
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.past_year.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: barchart_age.past_year.y,
                          backgroundColor: GRAYBAR_COLOR[200],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Past 1 month">
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.past_month.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: barchart_age.past_month.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* What proportion of the population in {{ area }} donates blood? */}
        <Section
          title="What proportion of the population in Klang Valley donates blood?"
          description="To ensure a stable and high supply of blood, we need 10% of the eliglble population to
              donate at least 1 time per year."
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full overflow-visible">
              <Tabs
                title="Donor rates across key demographics"
                //menu={<MenuDropdown />}
                state={currentState}
              >
                <Panel name="Per Capita">
                  <>
                    <Heatmap
                      className="flex h-[140px] overflow-visible"
                      data={[heatmap_donorrate.capita.male, heatmap_donorrate.capita.female]}
                      subdata
                      axisLeft="default"
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_donorrate.capita.male_chinese,
                        heatmap_donorrate.capita.male_indian,
                        heatmap_donorrate.capita.male_bumi,
                        heatmap_donorrate.capita.male_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_donorrate.capita.female_chinese,
                        heatmap_donorrate.capita.female_indian,
                        heatmap_donorrate.capita.female_bumi,
                        heatmap_donorrate.capita.female_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />
                  </>
                </Panel>
                <Panel name="% of Donations">
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-auto lg:overflow-visible"
                      data={[heatmap_donorrate.perc.male, heatmap_donorrate.perc.female]}
                      subdata
                      axisLeft="default"
                      unitY="%"
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_donorrate.perc.male_chinese,
                        heatmap_donorrate.perc.male_indian,
                        heatmap_donorrate.perc.male_bumi,
                        heatmap_donorrate.perc.male_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_donorrate.perc.female_chinese,
                        heatmap_donorrate.perc.female_indian,
                        heatmap_donorrate.perc.female_bumi,
                        heatmap_donorrate.perc.female_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />
                  </>
                </Panel>
                <Panel name="Absolute">
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-visible"
                      data={[heatmap_donorrate.abs.male, heatmap_donorrate.abs.female]}
                      subdata
                      axisLeft="default"
                      valueFormat="<-,.1~s"
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_donorrate.abs.male_chinese,
                        heatmap_donorrate.abs.male_indian,
                        heatmap_donorrate.abs.male_bumi,
                        heatmap_donorrate.abs.male_other,
                      ]}
                      subdata
                      valueFormat="<-,.2~s"
                      axisLeft="default"
                      axisTop={null}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_donorrate.abs.female_chinese,
                        heatmap_donorrate.abs.female_indian,
                        heatmap_donorrate.abs.female_bumi,
                        heatmap_donorrate.abs.female_other,
                      ]}
                      subdata
                      valueFormat="<-,.1~s"
                      axisLeft="default"
                      axisTop={null}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />
                  </>
                </Panel>
              </Tabs>
            </div>

            <Heatmap
              className="flex h-[600px] overflow-auto lg:overflow-visible "
              title="Donor retention: How well do we retain donors?"
              state={currentState}
              //menu={<MenuDropdown />}
              data={heatmap_retention}
              unitY="%"
              unitX="yr"
              axisLeft={{
                ticksPosition: "before",
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
              }}
              legend={{
                top: "Donated after N years",
                left: "Donated in",
              }}
              schema={BLOOD_DONATION_SCHEMA}
              color={BLOOD_DONATION_COLOR}
            />
          </div>
        </Section>

        {/* How is this data collected? */}
        <Section
          title="How is this data collected?"
          description="Map showing locations of BBIS centres:"
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <MapPinIcon className="h-5 w-auto text-dim" />
                  <h4>Zoom into my area</h4>
                </div>
                <Button
                  onClick={handleClearSelection}
                  disabled={!data.zoom_state}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  Clear Selection
                </Button>
              </div>
              <StateDropdown
                currentState={data.zoom_state}
                onChange={selected => {
                  setData("zoom_facility", undefined);
                  setData("zoom_state", selected.value);
                }}
                exclude={["kvy", "lbn", "pls", "pjy", "mys"]}
                width="w-full"
              />
              <Dropdown
                placeholder="Select facility"
                onChange={item => setData("zoom_facility", item)}
                selected={data.zoom_facility}
                disabled={!data.zoom_state}
                options={
                  data.zoom_state !== undefined
                    ? Object.keys(map_facility[data.zoom_state]).map((facility, index) => {
                        return {
                          label: facility,
                          value: index,
                        };
                      })
                    : []
                }
                width="w-full"
              />

              {timeseries_facility?.[data.zoom_state]?.[data.zoom_facility?.label] ? (
                <div className="w-full pt-7">
                  <Timeseries
                    className="h-[300px] w-full pt-4"
                    title="Daily Donations"
                    state={
                      <p className="text-sm text-dim">
                        Data for {data.zoom_facility?.label}, {CountryAndStates[data.zoom_state]}
                      </p>
                    }
                    //menu={<MenuDropdown />}
                    data={{
                      labels: timeseries_facility[data.zoom_state!][data.zoom_facility.label].x,
                      datasets: [
                        {
                          type: "line",
                          label: "Donation Center",
                          data: timeseries_facility[data.zoom_state!][data.zoom_facility.label]
                            .line,
                          borderColor: BLOOD_COLOR[400],
                          borderWidth: 1,
                        },
                        {
                          type: "bar",
                          label: "Outreach",
                          data: timeseries_facility[data.zoom_state!][data.zoom_facility.label]
                            .daily,
                          backgroundColor: BLOOD_COLOR[300],
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </div>
              ) : (
                <Empty
                  title="Daily Donations"
                  type="timeseries"
                  className="h-[300px] w-full pt-7"
                  placeholder="Please select a facility"
                />
              )}
            </div>

            <OSMapWrapper
              className="h-[460px] w-full rounded-xl"
              title={
                data.zoom_state && data.zoom_facility
                  ? `${data.zoom_facility.label}, ${CountryAndStates[data.zoom_state]}`
                  : "BBIS Centres in Malaysia"
              }
              zoom={data.zoom_facility ? 8 : 5}
              position={
                data.zoom_facility && data.zoom_state
                  ? [
                      map_facility[data.zoom_state][data.zoom_facility.label].lat,
                      map_facility[data.zoom_state][data.zoom_facility.label].lon,
                    ]
                  : undefined
              }
              markers={
                data.zoom_facility && data.zoom_state
                  ? [
                      {
                        name: `${data.zoom_facility.label}, ${CountryAndStates[data.zoom_state]}`,
                        position: [
                          map_facility[data.zoom_state][data.zoom_facility.label].lat,
                          map_facility[data.zoom_state][data.zoom_facility.label].lon,
                        ],
                      },
                    ]
                  : []
              }
            />
          </div>
        </Section>
      </Container>
    </>
  );
};

export default BloodDonationDashboard;
