import { Hero, Container } from "@components/index";
import { post } from "@lib/api";
import dynamic from "next/dynamic";
import { Stages, Table } from "@dashboards/covidnow/components";

import { InferGetStaticPropsType, GetStaticProps } from "next";

const Bar = dynamic(() => import("@dashboards/covidnow/components/Bar"), { ssr: false });
const BarLine = dynamic(() => import("@dashboards/covidnow/components/BarLine"), { ssr: false });
const Line = dynamic(() => import("@dashboards/covidnow/components/Line"), { ssr: false });
const Choropleth = dynamic(() => import("@dashboards/covidnow/components/Choropleth"), {
  ssr: false,
});
// dynamic(() => import('@dashboards/covidnow/components/index').then(components => components))

const CovidNow = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Hero background="hero-light-4">
        <div className="space-y-2 xl:w-1/2">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">covid-19</span>
          <h3 className="text-black">The latest data on the pandemic in Malaysia.</h3>
          <p className="text-dim">
            Drawing from the Ministry of Health's excellent COVIDNOW dashboard, this page allows you
            to track the evolution of the epidemic in Malaysia on a daily basis.
          </p>
          <p className="text-dim">
            For a more general look at infectious diseases such as measles, chicken pox, and HFMD,
            head on over to our{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              Infectious Diseases Dashboard.
            </a>
          </p>
        </div>
      </Hero>
      <Container className="min-h-screen">
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>How are COVID-19 key indicators trending?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="grid grid-cols-1 gap-12 py-6 lg:grid-cols-2 xl:grid-cols-3">
            <BarLine title="Deaths by Date of Death"></BarLine>
            <BarLine title="Patients Ventilated"></BarLine>
            <BarLine title="Patients in ICU"></BarLine>
            <BarLine title="Hospital Admissions"></BarLine>
            <BarLine title="Confirmed Cases"></BarLine>
            <BarLine title="Tests Conducted"></BarLine>
          </div>
        </section>
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>What does the latest data show?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-3">
              <Stages></Stages>
            </div>
            <div className="col-span-1 h-[550px]">
              <Bar
                keys={["y", "y2"]}
                interactive={false}
                indexBy="state"
                hideLabelKeys={["y2"]}
                customTickX="state"
                enableLabel={true}
                enableAxisX={false}
                enableGridX={false}
                enableGridY={false}
                layout="horizontal"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <Line
              className="h-[450px] w-full"
              title="Snapshot of Key Variables"
              gridYValues={[0, 25, 50, 75, 100]}
              unitY="%"
              enablePointLabel={true}
              enableGridX={false}
              minY={0}
              maxY={100}
            />
            <Choropleth title="Geographic Distribution of Key Variables"></Choropleth>
          </div>
        </section>
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>How vaccinated against COVID-19 are we?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div>
            <Table />
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

export default CovidNow;
