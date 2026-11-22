import type { MohBudgetPayload } from "@dashboards/moh-budget/types";
import { getPrivateJson } from "@lib/private-data";

/**
 * On/off switch for the MoH Budget dashboard (/dashboard/moh-budget). On unless the server
 * environment sets MOH_BUDGET_ENABLED=false: while off, the page returns 404, is left out of the
 * build and the sitemap, and has no card on the dashboards page. Server-only (getStaticProps /
 * getStaticPaths); a static build picks it up at build time, so rebuild after changing it.
 */
export const mohBudgetEnabled = () => process.env.MOH_BUDGET_ENABLED !== "false";

/**
 * The MoH Budget payload, dashboards/moh-budget.json, view-only like the fiscal data. It is built
 * from MoF's Budget books for the Ministry of Health (B.42 and P.42) by the dashboard's own
 * pipeline, which writes it into PRIVATE_DATA_SOURCE next to the fiscal and SHA 2011 payloads
 * (see lib/private-data.ts).
 */
export const getMohBudgetPayload = () =>
  getPrivateJson<MohBudgetPayload>("dashboards/moh-budget.json");
