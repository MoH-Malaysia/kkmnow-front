import SHA2011Page from "@dashboards/sha-2011/page";
import { PAGE_LOCALES } from "@lib/locales";
import { sha2011Props } from "@lib/sha-2011";
import { withi18n } from "datagovmy-ui/decorators";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-sha-2011", "common"],
  async () => sha2011Props("MYS"),
  { locales: PAGE_LOCALES }
);

export default SHA2011Page;
