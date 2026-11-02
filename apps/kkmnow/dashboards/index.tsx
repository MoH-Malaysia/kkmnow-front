import { AgencyBadge, At, Container, Hero, Section, Slider } from "datagovmy-ui/components";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, ReactNode, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Agency, WithData } from "datagovmy-ui/types";
import { routes } from "@lib/routes";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { BloodDropIcon, HeartIcon, MedicalCardIcon } from "datagovmy-ui/icons/kkmnow";
import { DateTime } from "luxon";
import AgencyIcon from "datagovmy-ui/icons/agency";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

/**
 * Dashboard Index
 * @overview Status: Live
 */

interface StatProps {
  icon: ReactNode;
  title: string;
  url: string;
  value: string;
  data_as_of: string;
  color: string; // accent: icon, corner wash, hover border
}

type Dashboard = {
  id: string;
  name: string;
  agency: Agency;
  route: string;
  /** i18n keys for the card when its text is not on the translation CDN (fiscal, SHA 2011) */
  text?: { name: string; description: string };
};

type View = {
  id: string;
  type: "dashboard";
  total_views: number;
};

interface DashboardIndexProps {
  last_updated: string;
  dashboards: WithData<Array<Dashboard>>;
  keystats: WithData<Record<string, { callout: number; data_as_of: string }>>;
  timeseries: WithData<
    Record<"x" | "views" | "line_views" | "downloads" | "line_downloads", Array<number>>
  >;
  timeseries_callout: WithData<
    Record<"downloads" | "views", { callout1: number; callout2: number }>
  >;
  financing?: { moh_budget: number; year: number } | null; // RM million, latest budget year
}

const DashboardIndex: FunctionComponent<DashboardIndexProps> = ({
  last_updated,
  dashboards,
  keystats,
  timeseries,
  timeseries_callout,
  financing,
}) => {
  const { t, i18n } = useTranslation(["kkmnow-home", "dashboards", "kkmnow-home-local"]);

  const twoMonths = Math.ceil(
    Math.abs(
      DateTime.fromSeconds(timeseries.data.x[timeseries.data.x.length - 1] / 1000)
        .minus({ months: 2 })
        .startOf("month")
        .diff(DateTime.fromSeconds(timeseries.data.x[timeseries.data.x.length - 1] / 1000), [
          "days",
        ]).days
    )
  );

  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - twoMonths, timeseries.data.x.length - 1],
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const yieldPrefix = (value: number) => (value >= 0 ? "+" : "");

  const yieldCallout = (key: "downloads" | "views") => {
    return [
      {
        title: t("daily"),
        value:
          yieldPrefix(timeseries_callout.data[key].callout1) +
          numFormat(timeseries_callout.data[key].callout1, "standard"),
      },
      {
        title: t("total"),
        value: numFormat(timeseries_callout.data[key].callout2, "standard"),
      },
    ];
  };

  const asOf = (d: string) =>
    t("kkmnow-home-local:as_of", { date: toDate(d, "dd MMM", i18n.language) });
  // Sources that stopped updating (COVID-19 cases and vaccination, bed and ICU use) are not shown
  // here; their dashboards remain.
  const STATS = useMemo<StatProps[]>(
    () => [
      {
        icon: <BloodDropIcon className="h-5 w-5" />,
        title: "stats.blood",
        url: routes.BLOOD_DONATION,
        value: numFormat(keystats.data.blood.callout, "standard", 0),
        data_as_of: asOf(keystats.data.blood.data_as_of),
        color: "#E11D48",
      },
      {
        icon: <HeartIcon className="h-5 w-5" />,
        title: "stats.organ",
        url: routes.ORGAN_DONATION,
        value: numFormat(keystats.data.organ.callout, "standard", 0),
        data_as_of: asOf(keystats.data.organ.data_as_of),
        color: "#7C3AED",
      },
      {
        icon: <MedicalCardIcon className="h-5 w-5" />,
        title: "stats.pekab40",
        url: routes.PEKA_B40,
        value: numFormat(keystats.data.pekab40.callout, "standard", 0),
        data_as_of: asOf(keystats.data.pekab40.data_as_of),
        color: "#30C3B2",
      },
      ...(financing
        ? [
            {
              icon: <BanknotesIcon className="h-5 w-5" />,
              title: "kkmnow-home-local:moh_budget",
              url: routes.FISCAL,
              value: t("kkmnow-home-local:moh_budget_value", {
                value: (financing.moh_budget / 1000).toFixed(1),
              }),
              data_as_of: t("kkmnow-home-local:budget_year", { year: financing.year }),
              color: "#2563EB",
            },
          ]
        : []),
    ],
    [i18n.language]
  );

  return (
    <>
      <Hero
        background="gray"
        category={[t("agencies:moh.full"), "text-primary"]}
        agencyBadge={<AgencyBadge agency="moh" />}
        header={[t("header")]}
        description={[t("description")]}
        className="relative"
        action={
          <div className="flex flex-wrap gap-3">
            <At className="btn-primary shadow-button text-sm" href="/data-catalogue" enableIcon>
              {t("common:nav.catalogue")}
            </At>
            <div className="absolute right-0 bottom-0 lg:right-6 pointer-events-none">
              <Image
                src="/static/images/kkm-hand-logo.png"
                className="opacity-10"
                width={250}
                height={250}
                alt="KKM hand logo"
              />
            </div>
          </div>
        }
      />
      <Container className="min-h-screen">
        <Section title={t("at_a_glance")}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map(({ data_as_of, icon, title, value, url, color }: StatProps) => (
              <Link
                key={url + title}
                href={url}
                className="border-outline dark:border-washed-dark group flex flex-col justify-between gap-4 rounded-2xl border p-5 transition hover:shadow-md"
                style={{
                  background: `radial-gradient(120% 90% at 100% 0%, ${color}17 0%, transparent 55%)`,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}80`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "")}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}1F`, color }}
                  >
                    {icon}
                  </span>
                  <span className="text-dim text-xs font-medium uppercase tracking-wide">
                    {t(title)}
                  </span>
                  <ArrowUpRightIcon className="text-dim ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                </div>
                <div>
                  <p className="text-3xl font-semibold tabular-nums leading-none">{value}</p>
                  <p className="text-dim mt-2 text-xs">{data_as_of}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section>
          <div className="flex flex-col gap-8">
            <h4 className="">{t("common:nav.dashboards")}</h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {dashboards.data.map((item, i) => (
                <DashboardCard item={item} key={i} />
              ))}
            </div>
          </div>
        </Section>

        <Section title={t("usage")} date={timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              className="h-[300px] w-full"
              title={t("views")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.views,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    label: t("views") as string,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                ],
              }}
              stats={yieldCallout("views")}
            />
            <Timeseries
              className="h-[300px] w-full"
              title={t("downloads")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.downloads,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    label: t("downloads") as string,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
              stats={yieldCallout("downloads")}
            />
          </div>

          <Slider
            type="range"
            value={data.minmax}
            data={timeseries.data.x}
            onChange={(e: any) => setData("minmax", e)}
          />
        </Section>
      </Container>
    </>
  );
};

const DashboardCard: FunctionComponent<{ item: Dashboard }> = ({ item }) => {
  const { t, i18n } = useTranslation(["dashboards"]);
  const [views, setViews] = useState<View[]>([]);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/pipes/page_views_by_id.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`,
            },
          }
        );
        const { data } = await response.json();
        setViews(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchViews();
  }, []);

  return (
    <At href={item.route} locale={i18n.language} prefetch={false}>
      <div className="border-outline hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50 group flex h-full w-full flex-col space-y-3 rounded-xl border p-6 transition-colors">
        <div className="relative flex items-center gap-3">
          <AgencyIcon
            agency={item.agency}
            className="h-6 w-6"
            fillColor={item.id === "dashboard-covid-vaccination" ? AKSARA_COLOR.GREEN : undefined}
          />
          <p className="text-dim font-medium text-sm">{t(`agencies:${item.agency}.abbr`)}</p>
          <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-100 lg:opacity-0 transition-transform group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transform-none" />
        </div>
        <div className="flex grow flex-col items-start gap-3 overflow-hidden">
          <div className="grow space-y-3">
            <p className="truncate text-lg font-bold dark:text-white" title={item.name}>
              {t(item.text?.name ?? `dashboards.${item.name}.name`)}
            </p>
            <p className="text-sm dark:text-white" title={item.name}>
              {t(item.text?.description ?? `dashboards.${item.name}.description`)}
            </p>
          </div>
          <div className="relative w-full">
            <p className="h-6 text-dim transition-transform group-hover:translate-y-6">
              {`${numFormat(views.find(e => e.id === item.id)?.total_views ?? 0, "compact")} ${t(
                "common:common.views",
                {
                  count: views.find(e => e.id === item.id)?.total_views ?? 0,
                }
              )}`}
            </p>
            <p className="text-primary dark:text-primary-dark absolute -bottom-6 transition-transform group-hover:-translate-y-6 motion-reduce:transform-none">
              {t("common:components.click_to_explore")}
            </p>
          </div>
        </div>
      </div>
    </At>
  );
};

export default DashboardIndex;
