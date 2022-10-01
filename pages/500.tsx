import { Container, ErrorCode, Metadata } from "@components/index";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Error500: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Uhh, bug alert!"} keywords={""} />
      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorCode
          title="Oops, something went terribly wrong."
          description="Please let us know about it"
          code={500}
          reason={"Error code: 500 -- Bug alert"}
        />
      </Container>
    </>
  );
};

export default Error500;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  return {
    props: {
      ...i18n,
    },
  };
};
