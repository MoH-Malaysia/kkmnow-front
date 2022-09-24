import { CountryAndStates } from "@lib/constants";

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
              <img className="h-3 w-5" src={`/static/images/states/${state}.jpeg`} />
              <span className="text-sm">{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      {
        id: "deaths",
        header: "Deaths",
        columns: [
          {
            id: "deaths.deaths",
            header: () => (
              <div>
                <p>Deaths</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.deaths.deaths.toFixed(1),
          },
          {
            id: "deaths.deaths_100k",
            header: () => (
              <div>
                <p>Per 100k</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.deaths.deaths_100k.toFixed(1),
          },
          {
            id: "deaths.deaths_trend",
            header: () => (
              <div>
                <p>Deaths Trend</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) =>
              item.deaths.deaths_trend !== null
                ? item.deaths.deaths_trend.toFixed(1)
                : item.deaths.deaths_trend,
          },
        ],
      },
      {
        id: "admitted",
        header: "Hospital Admissions",
        columns: [
          {
            id: "admitted.admitted",
            header: () => (
              <div>
                <p>Hospital Admission</p>
                <p>Past 14d</p>
              </div>
            ),
            maxWidth: 10,
            accessorFn: (item: any) => item.admitted.admitted.toFixed(1),
          },
          {
            id: "admitted.util_hosp",
            header: () => (
              <div>
                <p>Hospital Bed Utilisation</p>
              </div>
            ),
            accessorFn: (item: any) => item.admitted.util_hosp.toFixed(1),
          },
          {
            id: "admitted.admitted_trend",
            header: () => (
              <div>
                <p>Admissions Trend</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) =>
              item.admitted.admitted_trend !== null
                ? item.admitted.admitted_trend.toFixed(1)
                : item.admitted.admitted_trend,
          },
        ],
      },
      {
        id: "cases",
        header: "Cases",
        columns: [
          {
            id: "cases.cases",
            header: () => (
              <div>
                <p>Cases</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.cases.cases.toFixed(1),
          },
          {
            id: "cases.cases_100k",
            header: () => (
              <div>
                <p>Per 100k</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.cases.cases_100k.toFixed(1),
          },
          {
            id: "cases.cases_trend",
            header: () => (
              <div>
                <p>Cases Trend</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.cases.cases_trend.toFixed(1),
          },
          {
            id: "cases.cases_posrate",
            header: () => (
              <div>
                <p>Positivity Rate</p>
              </div>
            ),
            accessorFn: (item: any) => item.cases.cases_posrate.toFixed(1),
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
              <img className="h-3 w-5" src={`/static/images/states/${state}.jpeg`} />
              <span className="text-sm">{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      {
        id: "deaths",
        header: "Deaths",
        columns: [
          {
            id: "deaths.deaths",
            header: () => (
              <div>
                <p>Deaths</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.deaths.deaths.toFixed(1),
          },
          {
            id: "deaths.deaths_100k",
            header: () => (
              <div>
                <p>Per 100k</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.deaths.deaths_100k.toFixed(1),
          },
          {
            id: "deaths.deaths_trend",
            header: () => (
              <div>
                <p>Deaths Trend</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) =>
              item.deaths.deaths_trend !== null
                ? item.deaths.deaths_trend.toFixed(1)
                : item.deaths.deaths_trend,
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
              <img className="h-3 w-5" src={`/static/images/states/${state}.jpeg`} />
              <span className="text-sm">{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      {
        id: "admitted",
        header: "Hospital Admissions",
        columns: [
          {
            id: "admitted.admitted",
            header: () => (
              <div>
                <p>Hospital Admission</p>
                <p>Past 14d</p>
              </div>
            ),
            maxWidth: 10,
            accessorFn: (item: any) => item.admitted.admitted.toFixed(1),
          },
          {
            id: "admitted.util_hosp",
            header: () => (
              <div>
                <p>Hospital Bed Utilisation</p>
              </div>
            ),
            accessorFn: (item: any) => item.admitted.util_hosp.toFixed(1),
          },
          {
            id: "admitted.admitted_trend",
            header: () => (
              <div>
                <p>Admissions Trend</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) =>
              item.admitted.admitted_trend !== null
                ? item.admitted.admitted_trend.toFixed(1)
                : item.admitted.admitted_trend,
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
              <img className="h-3 w-5" src={`/static/images/states/${state}.jpeg`} />
              <span className="text-sm">{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      {
        id: "cases",
        header: "Cases",
        columns: [
          {
            id: "cases.cases",
            header: () => (
              <div>
                <p>Cases</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.cases.cases.toFixed(1),
          },
          {
            id: "cases.cases_100k",
            header: () => (
              <div>
                <p>Per 100k</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.cases.cases_100k.toFixed(1),
          },
          {
            id: "cases.cases_trend",
            header: () => (
              <div>
                <p>Cases Trend</p>
                <p>Past 14d</p>
              </div>
            ),
            accessorFn: (item: any) => item.cases.cases_trend.toFixed(1),
          },
          {
            id: "cases.cases_posrate",
            header: () => (
              <div>
                <p>Positivity Rate</p>
              </div>
            ),
            accessorFn: (item: any) => item.cases.cases_posrate.toFixed(1),
          },
        ],
      },
    ],
  },
];
