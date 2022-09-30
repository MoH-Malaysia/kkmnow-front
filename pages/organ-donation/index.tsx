/**
 * Organ Donation Page <Index>
 */
import { InferGetStaticPropsType, GetStaticProps } from "next";
import OrganDonationDashboard from "@dashboards/organ-donation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Metadata } from "@components/index";
import { get } from "@lib/api";
import { DateTime } from "luxon";

const OrganDonationIndex = ({
  timeseries_pledge,
  bar_age,
  bar_time,
  bar_reasons,
  heatmap_donorrate,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Organ Donation"} keywords={""} />
      <OrganDonationDashboard
        timeseries_pledge={timeseries_pledge}
        bar_age={bar_age}
        bar_time={bar_time}
        bar_reasons={bar_reasons}
        heatmap_donorrate={heatmap_donorrate}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "organ_donation", state: "mys" });

  // transform:
  data.barchart_time.monthly.x = data.barchart_time.monthly.x.map((item: any) => {
    const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
  });

  return {
    props: {
      ...i18n,
      timeseries_pledge: data.timeseries,
      bar_age: data.barchart_age,
      bar_time: data.barchart_time,
      bar_reasons: data.barchart_reasons,
      heatmap_donorrate: data.heatmap_pledgerrate,
    },
  };
};

export default OrganDonationIndex;
