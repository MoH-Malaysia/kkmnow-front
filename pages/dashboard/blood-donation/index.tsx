import { Hero, Container, Tabs, Panel, MenuDropdown, Dropdown, Tooltip } from "@components/index";
import { InferGetStaticPropsType, GetStaticProps } from "next";

import dynamic from "next/dynamic";
import { post } from "@lib/api";

const Bar = dynamic(() => import("@dashboards/covidnow/components/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@dashboards/covidnow/components/Heatmap"), { ssr: false });
const BarLine = dynamic(() => import("@dashboards/covidnow/components/BarLine"), { ssr: false });
const Table = dynamic(() => import("@dashboards/covidnow/components/Table"), { ssr: false });

const BloodDonation = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  //   const [currentTab, selectTab] = useState(0);
  //   const BarTabsMenu = [
  //     {
  //       name: "Deaths",
  //       title: "Deaths per 100K",
  //     },
  //     {
  //       name: "Vent.",
  //       title: "Ventilator per 100K",
  //     },
  //     {
  //       name: "ICU",
  //       title: "ICU per 100K",
  //     },
  //     {
  //       name: "Hosp.",
  //       title: "Hospital per 100K",
  //     },
  //     {
  //       name: "Cases",
  //       title: "Cases per 100K",
  //     },
  //   ];
  //   const TableTabsMenu = [
  //     {
  //       name: "Show All",
  //     },
  //     {
  //       name: "Total",
  //     },
  //     {
  //       name: "Adults",
  //     },
  //     {
  //       name: "Adolescents",
  //     },
  //     {
  //       name: "Children",
  //     },
  //   ];

  return (
    <>
      <Hero background="hero-light-1">
        <div className="space-y-2 xl:w-1/2">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">health</span>
          <h3 className="text-black">Blood Donation</h3>
          <p className="text-dim">
            For a more general look at infectious diseases such as measles, chicken pox, and HFMD,
            head on over to our A stable and high supply of blood is critical for a well-functioning
            public healthcare system. This dashboard, which gives you near-real-time updates on key
            indicators related to blood transfusion services, is brought to you by the{" "}
            <a href="#" className="font-semibold text-blue-600">
              National Blood Centre (PDN).
            </a>
          </p>
        </div>
      </Hero>
      <Container className="min-h-screen">
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>Is Klang Valley’s current blood supply sufficient?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="grid grid-cols-1 gap-12 py-6 xl:grid-cols-2 ">
            <BarLine title="Deaths by Date of Death" menu={<MenuDropdown />} />
            <BarLine title="Patients Ventilated" menu={<MenuDropdown />} />
          </div>
        </section>
        <section className="space-y-4 border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>What are the latest blood donation trends in Klang Valley?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="text-dim">
            <p>
              Blood compromises 3 components - red blood cells, platelets, and plasma. Although
              plasma can be stored for up to 1 year, red blood cells can be only stored for up to 35
              days, and plasma only for up to 5 days. Therefore, it is vital to maintain a high and
              stable level of blood donations; when blood donation activity is low or volatile,
              healthcare services that depend upon blood transfusions may start to come under
              stress.
            </p>
          </div>
          <div className="flex w-full flex-col gap-12">
            <BarLine title="Daily Donations" menu={<MenuDropdown />} />

            <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
              <BarLine title="Donation by donation type" menu={<MenuDropdown />} />
              <BarLine title="Donation by blood group (phenotype)" menu={<MenuDropdown />} />
              <BarLine title="Donation by donor type" menu={<MenuDropdown />} />
              <BarLine title="Donation by location" menu={<MenuDropdown />} />
            </div>
          </div>
        </section>
        <section className="space-y-4 border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>How strong is new donor recruitment in Klang Valley?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="text-dim">
            <p>
              Recruitment of new donors is vital to replace donors who reach their golden years and
              stop donating, as well as to support a growing population.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <Bar className="h-[300px]" title="Number of new donors" menu={<MenuDropdown />} />
            <Bar className="h-[300px]" title="New donors by age group" menu={<MenuDropdown />} />
          </div>
        </section>
        <section className="space-y-4 border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>What proportion of the population in Klang Valley donates blood?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="text-dim">
            <p>
              To ensure a stable and high supply of blood, we need 10% of the eliglble population to
              donate at least 1 time per year.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <Heatmap className="h-[500px]" />
            <Heatmap className="h-[500px]" />
          </div>
        </section>
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>How vaccinated against COVID-19 are we?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div>
            {/* <Tabs
              className="flex flex-wrap justify-end gap-2"
              title="Vaccination Progress by State"
            >
              {TableTabsMenu.map((menu, index) => {
                return (
                  <Panel key={index} title={menu.name}>
                    <Table />
                  </Panel>
                );
              })}
            </Tabs> */}
          </div>
        </section>
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
