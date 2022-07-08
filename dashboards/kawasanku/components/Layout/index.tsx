import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

import Map from "../Map";
import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Container from "@components/Container";
import GoogleMapWrapper from "@components/GoogleMapWrapper";

import exampleGeojson from "../../geojson/malaysia.json";

type KawasankuLayoutProps = {
  children: React.ReactNode;
};

const KawasankuLayout: FunctionComponent<KawasankuLayoutProps> = ({ children }) => {
  const { t } = useTranslation("kawasanku");

  const GMAPS_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY;
  if (GMAPS_KEY === undefined) throw new Error("Google Maps API key required.");

  return (
    <Layout>
      <div className="relative h-full w-full">
        <Hero
          background="to-transparent bg-gradient-to-r from-[#EDF8ED] via-[#EDF8ED]"
          className="z-10 flex w-full"
        >
          <div className="flex w-2/3 flex-col gap-8 text-dim">
            <div className="flex w-full flex-col gap-2">
              <p className="text-sm font-bold uppercase">{t("kawasanku")}</p>
              <h3 className="text-black">{t("header")}</h3>
              <div className="max-w-hero">
                <p>{t("description1")}</p>
                <br />
                <p>{t("description2")}</p>
              </div>
            </div>
            <p className="text-sm font-bold">{t("filter_title")}</p>
          </div>
          {/* GOOGLE MAP WRAPPER */}
        </Hero>
        <GoogleMapWrapper apiKey={GMAPS_KEY} map={<Map geojson={exampleGeojson} />} />
      </div>
      <Container>{children}</Container>
    </Layout>
  );
};

export default KawasankuLayout;
