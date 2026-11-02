import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import type { sha2011Props } from "@lib/sha-2011";
import SHA2011Dashboard from ".";

type Props = Extract<Awaited<ReturnType<typeof sha2011Props>>, { props: unknown }>["props"];

/**
 * Page body shared by /dashboard/sha-2011 (Malaysia) and /dashboard/sha-2011/[country].
 */
const SHA2011Page: Page = ({ meta, payload, shared }: Props) => {
  const { t } = useTranslation(["dashboard-sha-2011", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={`${t("header")} · ${payload.country.name}`}
        description={t("description")}
        keywords={""}
      />
      <SHA2011Dashboard {...payload} shared={shared} />
    </AnalyticsProvider>
  );
};

export default SHA2011Page;
