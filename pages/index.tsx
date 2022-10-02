import Image from "next/image";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import type { InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { Page } from "@lib/types";
import { BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";

import { Hero, Container, Metadata } from "@components/index";

const Home: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;

  // TODO: update last image after launch day
  const imageArr = [
    "/static/images/home-citfgithub.png",
    "/static/images/home-mohgithub.png",
    "/static/images/home-covidnow.png",
    "/static/images/home-endemic.png",
    "/static/images/home-hero.png",
  ];

  const content: { date: string; title: string; description: string }[] = t(
    "home.timeline.events",
    { returnObjects: true }
  );

  const timeline = content.map((item, index) => ({
    ...item,
    image: imageArr[index],
  }));

  return (
    <>
      <Metadata title={"KKMNOW"} keywords={""} />

      <Hero
        background="bg-home-hero"
        className="relative flex min-h-[300px] flex-col items-center justify-center text-left md:text-center"
      >
        <h3 className="mb-3">{t("home.title")}</h3>
        <p className="max-w-3xl text-dim">{t("home.description")}</p>
      </Hero>
      <Container className="min-h-screen py-12">
        <h3 className="mb-8 md:text-center">{t("home.timeline.title")}</h3>
        {timeline.map((event, index) => (
          <div className="flex gap-8">
            {/* TIMELINE FOR MOBILE DEVICES */}
            {isMobile && (
              <div className="w-4">
                <div className="relative flex h-full items-center justify-center pt-1">
                  <div className="absolute top-1 left-0 z-10 h-4 w-4 rounded-full bg-black" />
                  <div className="absolute top-0 left-2 h-full border-l border-dashed border-outlineHover" />
                </div>
              </div>
            )}
            <div
              className={`
              flex flex-col-reverse gap-1 md:flex-row md:gap-8
              ${index === 0 ? "" : ""} 
              ${index % 2 === 0 ? "" : "md:flex-row-reverse"}
            `}
            >
              {/* TITLE, DESCRIPTION, IMAGE */}
              <div
                className={`
                mb-12 flex w-full flex-col gap-6 md:w-1/2 lg:flex-row
                ${index % 2 === 0 ? "md:text-right" : "lg:flex-row-reverse"}
              `}
              >
                <div>
                  <p className="mb-1 text-lg font-bold">{event.title}</p>
                  <p>{event.description}</p>
                </div>
                <div className="min-h-[90px] min-w-[120px]">
                  <Image
                    width={120}
                    height={90}
                    src={event.image}
                    className="rounded-md object-cover"
                  />
                </div>
              </div>
              {/* TIMELINE FOR TABLET DEVICES (768px and up) */}
              {!isMobile && (
                <div className="w-[80px]">
                  <div className="relative flex h-full items-center justify-center pt-1">
                    <div className="absolute top-1 z-10 h-4 w-4 rounded-full bg-black" />
                    <div className="absolute top-3 w-[80px] border-t border-black" />
                    <div className="absolute top-0 h-full border-l border-dashed border-outlineHover" />
                  </div>
                </div>
              )}
              {/* DATE */}
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "" : "md:text-right"}`}>
                <p className="text-dim">{event.date}</p>
              </div>
            </div>
          </div>
        ))}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translation = await serverSideTranslations(locale!, ["common"]);

  return {
    props: {
      ...translation,
    },
    revalidate: 1,
  };
};

export default Home;
