import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Container from "@components/Container";

type KawasankuLayoutProps = {
  children: React.ReactNode;
};

const KawasankuLayout: FunctionComponent<KawasankuLayoutProps> = ({ children }) => {
  const { t } = useTranslation("kawasanku");

  return (
    <Layout>
      <Hero background="bg-[#EDF8ED]" className="flex flex-col gap-8 text-dim">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold uppercase">{t("kawasanku")}</p>
          <h3 className="text-black">{t("header")}</h3>
          <div className="max-w-hero">
            <p>{t("description1")}</p>
            <br />
            <p>{t("description2")}</p>
          </div>
        </div>
        <p className="text-sm font-bold">{t("filter_title")}</p>
      </Hero>
      <Container>{children}</Container>
    </Layout>
  );
};

export default KawasankuLayout;
