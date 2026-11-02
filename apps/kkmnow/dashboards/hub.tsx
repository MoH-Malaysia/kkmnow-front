import { At, Card, Container, Hero, Section } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

export type HubEntry = {
  route: string;
  /** i18n keys for the card, e.g. "dashboards:dashboards.covid-19.name" */
  name: string;
  description: string;
};

/**
 * Dashboards hub: one card per dashboard. Names and descriptions come from each entry's own
 * i18n keys, so dashboards not yet on the translation CDN can list themselves too.
 */
const DashboardHub: FunctionComponent<{ entries: HubEntry[] }> = ({ entries }) => {
  const { t } = useTranslation(["dashboards", "common"]);

  return (
    <>
      <Hero
        background="blue"
        header={[t("dashboards:header")]}
        description={[t("dashboards:description"), "text-dim"]}
      />
      <Container className="min-h-screen">
        <Section title={t("dashboards:section2_title")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map(({ route, name, description }) => (
              <At key={route} href={route} className="group">
                <Card className="hover:border-primary dark:hover:border-primary-dark h-full p-6">
                  <h5 className="group-hover:text-primary dark:group-hover:text-primary-dark">
                    {t(name)}
                  </h5>
                  <p className="text-dim mt-2 text-sm">{t(description)}</p>
                </Card>
              </At>
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default DashboardHub;
