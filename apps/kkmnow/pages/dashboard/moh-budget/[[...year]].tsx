import { Metadata } from "datagovmy-ui/components";
import MohBudgetDashboard from "@dashboards/moh-budget";
import type { MohBudgetProps } from "@dashboards/moh-budget/types";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { getMohBudgetPayload, mohBudgetEnabled } from "@lib/moh-budget";
import { PAGE_LOCALES } from "@lib/locales";
import i18nConfig from "../../../next-i18next.config";

const MohBudget: Page = ({ meta, ...props }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-moh-budget", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("header")}
        description={t("description", {
          from: props.budget_years[0],
          to: props.budget_years[props.budget_years.length - 1],
        })}
        keywords={""}
      />
      <MohBudgetDashboard {...(props as MohBudgetProps)} />
    </AnalyticsProvider>
  );
};

// One page per Budget year, so a page carries only its own book, in every language including the
// page-only ones while they are switched on (see lib/locales.ts).
export const getStaticPaths: GetStaticPaths = async () => {
  if (!mohBudgetEnabled()) return { paths: [], fallback: "blocking" };
  const data = await getMohBudgetPayload();
  const locales: string[] = i18nConfig.i18n.locales;
  return {
    paths: Object.keys(data.books).flatMap(year =>
      locales.map((locale: string) => ({ params: { year: [year] }, locale }))
    ),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-moh-budget", "common"],
  async ({ params }) => {
    // Switched off (lib/moh-budget.ts): the page doesn't exist and its data is never read
    if (!mohBudgetEnabled()) return { notFound: true };

    // Built by the MoH Budget pipeline (see lib/moh-budget.ts). View-only: never committed
    const { books, ...data } = await getMohBudgetPayload();
    const budget_years = Object.keys(books).map(Number).sort();
    const requested = params?.year ? Number(params.year[0]) : budget_years[budget_years.length - 1];
    if (params?.year && (params.year.length > 1 || !books[String(requested)])) {
      return { notFound: true };
    }

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-moh-budget",
          type: "dashboard",
          category: "public-finances",
          agency: "MOH",
        },
        ...data,
        budget_years,
        budget_year: requested,
        book: books[String(requested)],
        book_facts: Object.fromEntries(
          Object.entries(books).map(([year, b]) => [
            year,
            {
              actual_period: b.de.actual_period,
              adjustment_revised: b.de.adjustment?.revised ?? null,
              total_revised: b.de.total?.revised ?? null,
            },
          ])
        ),
      },
    };
  },
  { locales: PAGE_LOCALES }
);

export default MohBudget;
