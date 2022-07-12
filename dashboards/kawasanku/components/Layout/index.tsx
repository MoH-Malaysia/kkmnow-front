import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import Map from "../Map";
import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Container from "@components/Container";
import GoogleMapWrapper from "@components/GoogleMapWrapper";

import { BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";
import exampleGeojson from "../../geojson/malaysia.json";

type KawasankuLayoutProps = {
  children: React.ReactNode;
};

const KawasankuLayout: FunctionComponent<KawasankuLayoutProps> = ({ children }) => {
  const { t } = useTranslation("kawasanku");

  const width = useWindowWidth();

  const ref = useRef<HTMLDivElement>(null);

  const [heroHeight, setHeroHeight] = useState<number>();

  const GMAPS_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY;
  if (GMAPS_KEY === undefined) throw new Error("Google Maps API key required.");

  useEffect(() => {
    if (ref.current && width) {
      setHeroHeight(ref.current.clientHeight);
    }
  }, [width, ref]);

  return (
    <Layout>
      <div
        ref={ref}
        className="relative h-full w-full"
        style={{ ...(width < BREAKPOINTS.LG && heroHeight && { height: heroHeight + 100 }) }}
      >
        <Hero
          background="to-transparent bg-gradient-to-b lg:bg-gradient-to-r from-[#EDF8ED] via-[#EDF8ED]"
          className="z-10 flex w-full lg:grid lg:grid-cols-12"
        >
          <div className="text-dim lg:col-span-7">
            <div className="mb-10 flex w-full flex-col gap-2">
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
        <GoogleMapWrapper
          apiKey={GMAPS_KEY}
          map={<Map geojson={exampleGeojson} height={heroHeight} />}
        />
      </div>
      <Container>{children}</Container>
    </Layout>
  );
};

export default KawasankuLayout;
