import { Container, ErrorCode, Metadata } from "@components/index";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Error404: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Oops, page not found!"} keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorCode
          title="Oops, we can't seem to find the page you're looking for."
          description="Maybe check the spelling in your URLs"
          code={404}
          reason={"Error code: 404 -- Page not found"}
        />
      </Container>
    </>
  );
};

export default Error404;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  return {
    props: {
      ...i18n,
    },
  };
};
