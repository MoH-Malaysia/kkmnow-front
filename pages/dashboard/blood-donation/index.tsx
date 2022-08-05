import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  Dropdown,
  Tooltip,
  Section,
} from "@components/index";
import { Slider } from "@dashboards/covidnow/components";
import { InferGetStaticPropsType, GetStaticProps } from "next";

import dynamic from "next/dynamic";
import { post } from "@lib/api";

const Bar = dynamic(() => import("@dashboards/covidnow/components/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@dashboards/covidnow/components/Heatmap"), { ssr: false });
const Line = dynamic(() => import("@dashboards/covidnow/components/Line"), { ssr: false });
const BarLine = dynamic(() => import("@dashboards/covidnow/components/BarLine"), { ssr: false });

const BloodDonation = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Hero background="hero-light-1">
        <div className="space-y-2 xl:w-1/2">
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
        </div>
      </Hero>
      <Container className="min-h-screen">
        {/* Is {{ area }}'s current blood supply sufficient? */}
        <Section title="Is Klang Valley's current blood supply sufficient?">
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2 ">
            <Heatmap
              className="h-[500px]"
              title="Blood Supply by States"
              hoverTarget="row"
              menu={<MenuDropdown />}
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
                menu={<MenuDropdown />}
              >
                <Panel name="Type A">
                  <Line
                    className="h-[500px] w-full"
                    lineWidth={1}
                    maxY={75}
                    enableArea={true}
                    enableGridX={false}
                    enablePoint={false}
                    enablePointLabel={false}
                    enableLabel={false}
                  />
                </Panel>
                <Panel name="Type B">
                  <Line
                    className="h-[500px] w-full"
                    lineWidth={0}
                    enableArea={true}
                    enableGridX={false}
                    enablePoint={false}
                    enablePointLabel={false}
                    enableLabel={false}
                  />
                </Panel>
                <Panel name="Type AB">
                  <Line
                    className="h-[500px] w-full"
                    lineWidth={0}
                    enableArea={true}
                    enableGridX={false}
                    enablePoint={false}
                    enablePointLabel={false}
                    enableLabel={false}
                  />
                </Panel>
                <Panel name="Type O">
                  <Line
                    className="h-[500px] w-full"
                    lineWidth={0}
                    enableArea={true}
                    enableGridX={false}
                    enablePoint={false}
                    enablePointLabel={false}
                    enableLabel={false}
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
              <BarLine title="Daily Donations" menu={<MenuDropdown />} stats={null} />
              <Slider className="pt-7" type="default" onChange={(item: any) => console.log(item)} />
              <span className="text-sm text-dim">
                Use this time slider to zoom in specific time range
              </span>
            </div>

            <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
              <BarLine title="Donation by donation type" menu={<MenuDropdown />} stats={null} />
              <BarLine
                title="Donation by blood group (phenotype)"
                menu={<MenuDropdown />}
                stats={null}
              />
              <BarLine title="Donation by donor type" menu={<MenuDropdown />} stats={null} />
              <BarLine title="Donation by location" menu={<MenuDropdown />} stats={null} />
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
              <Tabs title="Number of new donors" menu={<MenuDropdown />}>
                <Panel name="Annual">
                  <Bar className="h-[300px]" />
                </Panel>
                <Panel name="Monthly">
                  <Bar className="h-[300px]" />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title="New donors by age group" menu={<MenuDropdown />}>
                <Panel name="Past 1 year">
                  <Bar className="h-[300px]" />
                </Panel>
                <Panel name="Past 1 month">
                  <Bar className="h-[300px]" />
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
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <Heatmap className="h-[500px]" />
            <Heatmap className="h-[500px]" />
          </div>
        </Section>

        {/* How is this data collected? */}
        <Section
          title="How is this data collected?"
          description="Map showing locations of BBIS centres:"
        >
          <p>Map goes here</p>
        </Section>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  // const { data } = await post("") // your fetch function here

  return {
    props: {},
  };
};

export default BloodDonation;
