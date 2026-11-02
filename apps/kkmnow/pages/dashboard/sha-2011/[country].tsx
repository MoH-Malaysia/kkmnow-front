import SHA2011Page from "@dashboards/sha-2011/page";
import { PAGE_LOCALES } from "@lib/locales";
import { sha2011Props } from "@lib/sha-2011";
import { withi18n } from "datagovmy-ui/decorators";
import { GetStaticPaths, GetStaticProps } from "next";

// Malaysia is prebuilt at /dashboard/sha-2011; other countries render on first visit
export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: "blocking" });

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-sha-2011", "common"],
  async ({ params }) => sha2011Props(String(params?.country ?? "").toUpperCase()),
  { locales: PAGE_LOCALES }
);

export default SHA2011Page;
