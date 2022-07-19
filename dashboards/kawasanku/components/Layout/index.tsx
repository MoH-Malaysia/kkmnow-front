import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FunctionComponent, useEffect, useRef, useState } from "react";

import Map from "../Map";
import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";
import GoogleMapWrapper from "@components/GoogleMapWrapper";

import { BREAKPOINTS, STATES } from "@lib/constants";
import { DASHBOARD_ROUTES } from "@lib/routes";
import { useWindowWidth } from "@hooks/useWindowWidth";
import exampleGeojson from "../../geojson/malaysia.json";
import { GEO_FILTER } from "@dashboards/kawasanku/lib/constants";

type KawasankuLayoutProps = {
  children: React.ReactNode;
};

const KawasankuLayout: FunctionComponent<KawasankuLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation("kawasanku");

  const width = useWindowWidth();

  const heroRef = useRef<HTMLDivElement>(null);

  const [isExpand, setIsExpand] = useState(false);
  const [heroHeight, setHeroHeight] = useState<number>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const GMAPS_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY;
  if (GMAPS_KEY === undefined) throw new Error("Google Maps API key required.");

  useEffect(() => {
    if (heroRef.current && width) {
      setHeroHeight(heroRef.current.clientHeight + 200);
    }

    setIsInitialLoad(false);
  }, [width]);

  useEffect(() => {
    if (heroRef.current) {
      if (isExpand) {
        setHeroHeight(heroRef.current.clientHeight + 300);
      } else if (!isExpand && !isInitialLoad) {
        setHeroHeight(heroRef.current.clientHeight - 300);
      }
    }
  }, [isExpand]);

  return (
    <Layout>
      <div
        ref={heroRef}
        className="relative h-full w-full"
        style={{ ...(width < BREAKPOINTS.LG && heroHeight && { height: heroHeight }) }}
      >
        <Hero
          background="to-transparent bg-gradient-to-b lg:bg-gradient-to-r from-[#EDF8ED] via-[#EDF8ED]"
          className="z-10 flex w-full lg:grid lg:grid-cols-12"
        >
          <div className="text-dim lg:col-span-7">
            {/* HERO CONTENT */}
            <div className="mb-10 flex w-full flex-col gap-2">
              <p className="text-sm font-bold uppercase">{t("kawasanku")}</p>
              <h3 className="text-black">{t("header")}</h3>
              <div className="max-w-hero">
                <p
                  className={`${isExpand ? "line-clamp-none" : "line-clamp-2"} lg:line-clamp-none`}
                >
                  {t("description1")}
                </p>
                <br className={`${isExpand ? "block" : "hidden"} lg:block`} />
                <p className={`${isExpand ? "block" : "hidden"} lg:block`}>{t("description2")}</p>
              </div>
              {width < BREAKPOINTS.LG && (
                <p
                  className="cursor-pointer text-sm font-bold"
                  onClick={() => setIsExpand(!isExpand)}
                >
                  Read {isExpand ? "less" : "more"}
                </p>
              )}
            </div>
            {/* FILTERS */}
            {/* TODO (@itschrislow): update filters onChange function after API is ready */}
            <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center">
              <p className="text-sm font-bold">{t("filter_title")}: </p>
              <Dropdown
                onChange={state =>
                  router.push(`${DASHBOARD_ROUTES.KAWASANKU}/${state.value}`, {
                    query: router.query,
                  })
                }
                options={STATES.map(state => ({
                  label: state.name,
                  value: state.key,
                }))}
                placeholder={t("filter1_placeholder")}
              />
              <Dropdown
                onChange={() => {}}
                options={Object.values(GEO_FILTER).map(geo => ({ label: t(geo), value: geo }))}
                placeholder={t("filter2_placeholder")}
              />
              {/* TODO (@itschrislow): update area options after API is ready */}
              <Dropdown
                onChange={area =>
                  router.push(`${router.pathname}/${area.value}`, {
                    query: router.query,
                  })
                }
                options={STATES.map(state => ({
                  label: state.name,
                  value: state.key,
                }))}
                placeholder={t("filter3_placeholder")}
              />
            </div>
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
