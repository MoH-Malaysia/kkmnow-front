import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import type { InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { Page } from "@lib/types";

import { Hero, Container } from "@components/index";

const Kawasanku: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("kawasanku");

  return (
    <>
      <Hero background="bg-[#EDF8ED]" className="flex flex-col gap-8 text-dim">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold uppercase">{t("kawasanku")}</p>
          <h3 className="text-black">{t("header")}</h3>
          <div className="max-w-hero">
            <p>{t("description1")}</p>
            <p>{t("description2")}</p>
          </div>
        </div>
        <p className="text-sm font-bold">{t("filter_title")}</p>
      </Hero>
      <Container className="min-h-screen"> </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translation = await serverSideTranslations(locale!, ["kawasanku"]);

  return {
    props: {
      ...translation,
    },
  };
};

export default Kawasanku;
