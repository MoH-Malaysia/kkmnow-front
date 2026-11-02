import type { CountryPayload, SharedPayload } from "@dashboards/sha-2011/types";
import { getPrivateJson } from "@lib/private-data";

/**
 * getStaticProps body for one country of /dashboard/sha-2011. Import only from getStaticProps.
 * Payloads are built by the data pipeline's exporter (see lib/private-data.ts) and are view-only:
 * kept out of git and off the public bucket.
 */
export const sha2011Props = async (code: string) => {
  const shared = await getPrivateJson<SharedPayload>("dashboards/sha-2011-shared.json");
  // Also guards the file name below: only known country codes reach it
  if (!shared.countries.some(c => c.code === code)) return { notFound: true as const };

  const payload = await getPrivateJson<CountryPayload>(
    `dashboards/sha-2011-${code.toLowerCase()}.json`
  );
  return {
    props: {
      meta: {
        id: "dashboard-sha-2011",
        type: "dashboard" as const,
        category: "healthcare" as const,
        agency: "MOH",
      },
      payload,
      shared,
    },
  };
};
