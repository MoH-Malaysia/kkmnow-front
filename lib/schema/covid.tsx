import { CountryAndStates } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import Image from "next/image";
export const COVID_TABLE_SCHEMA = [
  {
    name: "Show All",
    config: [
      {
        header: "",
        id: "state",
        accessorKey: "state",
        enableSorting: false,
        cell: (item: any) => {
          const state = item.getValue() as string;
          return (
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/states/${state}.jpeg`}
                width={20}
                height={12}
                alt={CountryAndStates[state]}
              />
              <span className="text-sm">{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      {
        id: "deaths",
        columns: [
          {
            id: "deaths.deaths",
            header: "Deaths",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.deaths.deaths, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "deaths.deaths_100k",
            header: "Per 100K",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.deaths.deaths_100k, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "deaths.deaths_trend",
            header: "Deaths Trend",
            subheader: "Past 14d",
            accessorFn: (item: any) =>
              item.deaths.deaths_trend && +item.deaths.deaths_trend.toFixed(1),
            relative: true,
            inverse: true,
            unit: "%",
          },
        ],
      },
      {
        id: "admitted",
        columns: [
          {
            id: "admitted.admitted",
            header: "Hospital Admission",
            subheader: "Past 14d",
            maxWidth: 10,
            accessorFn: (item: any) => numFormat(item.admitted.admitted, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "admitted.util_hosp",
            header: "Hospital Bed Utilisation",
            accessorFn: (item: any) => +item.admitted.util_hosp.toFixed(1),
            unit: "%",
          },
          {
            id: "admitted.admitted_trend",
            header: "Admissions Trend",
            subheader: "Past 14d",
            accessorFn: (item: any) =>
              item.admitted.admitted_trend !== null
                ? +item.admitted.admitted_trend.toFixed(1)
                : item.admitted.admitted_trend,
            relative: true,
            inverse: true,
            unit: "%",
          },
        ],
      },
      {
        id: "cases",
        columns: [
          {
            id: "cases.cases",
            header: "Cases",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.cases.cases, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "cases.cases_100k",
            header: "Per 100K",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.cases.cases_100k, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "cases.cases_posrate",
            header: "Positivity Rate",
            accessorFn: (item: any) => +item.cases.cases_posrate.toFixed(1),
            unit: "%",
          },
          {
            id: "cases.cases_trend",
            header: "Cases Trend",
            subheader: "Past 14d",
            accessorFn: (item: any) => +item.cases.cases_trend.toFixed(1),
            relative: true,
            inverse: true,
            unit: "%",
          },
        ],
      },
    ],
  },
  {
    name: "Deaths",
    config: [
      {
        header: "",
        id: "state",
        accessorKey: "state",
        enableSorting: false,
        cell: (item: any) => {
          const state = item.getValue() as string;
          return (
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/states/${state}.jpeg`}
                width={20}
                height={12}
                alt={CountryAndStates[state]}
              />
              <span className="text-sm">{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      {
        id: "deaths",
        columns: [
          {
            id: "deaths.deaths",
            header: "Deaths",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.deaths.deaths, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "deaths.deaths_100k",
            header: "Per 100K",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.deaths.deaths_100k, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "deaths.deaths_trend",
            header: "Deaths Trend",
            subheader: "Past 14d",
            accessorFn: (item: any) =>
              item.deaths.deaths_trend !== null
                ? +item.deaths.deaths_trend.toFixed(1)
                : item.deaths.deaths_trend,
            relative: true,
            inverse: true,
            unit: "%",
          },
        ],
      },
    ],
  },
  {
    name: "Hosp.",
    config: [
      {
        header: "",
        id: "state",
        accessorKey: "state",
        enableSorting: false,
        cell: (item: any) => {
          const state = item.getValue() as string;
          return (
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/states/${state}.jpeg`}
                width={20}
                height={12}
                alt={CountryAndStates[state]}
              />
              <span className="text-sm">{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      {
        id: "admitted",
        columns: [
          {
            id: "admitted.admitted",
            header: "Hospital Admissions",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.admitted.admitted, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "admitted.util_hosp",
            header: "Hospital Bed Utilisation",
            accessorFn: (item: any) => +item.admitted.util_hosp.toFixed(1),
            unit: "%",
          },
          {
            id: "admitted.admitted_trend",
            header: "Admissions Trend",
            subheader: "Past 14d",
            accessorFn: (item: any) =>
              item.admitted.admitted_trend !== null
                ? +item.admitted.admitted_trend.toFixed(1)
                : item.admitted.admitted_trend,
            relative: true,
            inverse: true,
            unit: "%",
          },
        ],
      },
    ],
  },
  {
    name: "Cases",
    config: [
      {
        header: "",
        id: "state",
        accessorKey: "state",
        enableSorting: false,
        cell: (item: any) => {
          const state = item.getValue() as string;
          return (
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/states/${state}.jpeg`}
                width={20}
                height={12}
                alt={CountryAndStates[state]}
              />
              <span className="text-sm">{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      {
        id: "cases",
        columns: [
          {
            id: "cases.cases",
            header: "Cases",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.cases.cases, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "cases.cases_100k",
            header: "Per 100K",
            subheader: "Past 14d",
            accessorFn: (item: any) => numFormat(item.cases.cases_100k, "standard"),
            sortingFn: "localeNumber",
          },
          {
            id: "cases.cases_posrate",
            header: "Positivity Rate",
            accessorFn: (item: any) => item.cases.cases_posrate.toFixed(1),
            unit: "%",
          },
          {
            id: "cases.cases_trend",
            header: "Cases Trend",
            subheader: "Past 14d",
            accessorFn: (item: any) => +item.cases.cases_trend.toFixed(1),
            relative: true,
            inverse: true,
            unit: "%",
          },
        ],
      },
    ],
  },
];
