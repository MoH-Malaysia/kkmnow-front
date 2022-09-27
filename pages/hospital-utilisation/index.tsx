import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const HospitalUtilisationPage: Page = ({
  pageComponentProps,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <>hello</>;
};

export const getStaticProps: GetStaticProps = async ctx => {
  // const { data } = await  // your fetch function here

  return {
    props: {},
  };
};
