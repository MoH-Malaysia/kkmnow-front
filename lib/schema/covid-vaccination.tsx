import { CountryAndStates } from "@lib/constants";

export const VACCINE_TABLE_SCHEMA = [
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
        id: "total",
        header: "Total",
        columns: [
          {
            id: "total.perc_dose1",
            header: "% 1 Dose",
            accessorFn: (item: any) => item.total.perc_dose1.toFixed(1),
          },
          {
            id: "total.perc_dose2",
            header: "% 2 Doses",
            accessorFn: (item: any) => item.total.perc_dose2.toFixed(1),
          },
          {
            id: "total.perc_booster1",
            header: "% 1 Booster",
            accessorFn: (item: any) => item.total.perc_booster1.toFixed(1),
          },
          {
            id: "total.perc_booster2",
            header: "% 2 Booster",
            accessorFn: (item: any) => item.total.perc_booster2.toFixed(1),
          },
        ],
      },
      {
        id: "adult",
        header: "Adults",
        columns: [
          {
            id: "adult.perc_dose1",
            header: "% 1 Dose",
            accessorFn: (item: any) => item.adult.perc_dose1.toFixed(1),
          },
          {
            id: "adult.perc_dose2",
            header: "% 2 Doses",
            accessorFn: (item: any) => item.adult.perc_dose2.toFixed(1),
          },
          {
            id: "adult.perc_booster1",
            header: "% 1 Booster",
            accessorFn: (item: any) => item.adult.perc_booster1.toFixed(1),
          },
          {
            id: "adult.perc_booster2",
            header: "% 2 Booster",
            accessorFn: (item: any) => item.adult.perc_booster2.toFixed(1),
          },
        ],
      },
      {
        id: "adolescent",
        header: "Adolescent",
        columns: [
          {
            id: "adol.perc_dose1",
            header: "% 1 Dose",
            accessorFn: (item: any) => item.adol.perc_dose1.toFixed(1),
          },
          {
            id: "adol.perc_dose2",
            header: "% 2 Doses",
            accessorFn: (item: any) => item.adol.perc_dose2.toFixed(1),
          },
          {
            id: "perc_booster1",
            header: "% 1 Booster",
            accessorFn: (item: any) => item.adol.perc_booster1.toFixed(1),
          },
        ],
      },
      {
        id: "children",
        header: "Children",
        columns: [
          {
            id: "child.perc_dose1",
            header: "% 1 Dose",
            accessorFn: (item: any) => item.child.perc_dose1.toFixed(1),
          },
          {
            id: "child.perc_dose2",
            header: "% 2 Doses",
            accessorFn: (item: any) => item.child.perc_dose2.toFixed(1),
          },
          {
            id: "child.perc_booster1",
            header: "% 1 Booster",
            accessorFn: (item: any) => item.child.perc_booster1.toFixed(1),
          },
        ],
      },
    ],
  },
  {
    name: "Total",
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
        id: "total",
        header: "Total",
        columns: [
          {
            id: "total.perc_dose1",
            header: "% 1 Dose",
            accessorFn: (item: any) => item.total.perc_dose1.toFixed(1),
          },
          {
            id: "total.perc_dose2",
            header: "% 2 Doses",
            accessorFn: (item: any) => item.total.perc_dose2.toFixed(1),
          },
          {
            id: "total.perc_booster1",
            header: "% 1 Booster",
            accessorFn: (item: any) => item.total.perc_booster1.toFixed(1),
          },
          {
            id: "total.perc_booster2",
            header: "% 2 Booster",
            accessorFn: (item: any) => item.total.perc_booster2.toFixed(1),
          },
        ],
      },
    ],
  },
  {
    name: "Adults",
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
        id: "adult",
        header: "Adults",
        columns: [
          {
            id: "adult.perc_dose1",
            header: "% 1 Dose",
            accessorFn: (item: any) => item.adult.perc_dose1.toFixed(1),
          },
          {
            id: "adult.perc_dose2",
            header: "% 2 Doses",
            accessorFn: (item: any) => item.adult.perc_dose2.toFixed(1),
          },
          {
            id: "adult.perc_booster1",
            header: "% 1 Booster",
            accessorFn: (item: any) => item.adult.perc_booster1.toFixed(1),
          },
          {
            id: "adult.perc_booster2",
            header: "% 2 Booster",
            accessorFn: (item: any) => item.adult.perc_booster2.toFixed(1),
          },
        ],
      },
    ],
  },
  {
    name: "Adolescents",
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
        id: "adolescent",
        header: "Adolescents",
        columns: [
          {
            id: "adol.perc_dose1",
            header: "% 1 Dose",
            accessorFn: (item: any) => item.adol.perc_dose1.toFixed(1),
          },
          {
            id: "adol.perc_dose2",
            header: "% 2 Doses",
            accessorFn: (item: any) => item.adol.perc_dose2.toFixed(1),
          },
          {
            id: "adol.perc_booster1",
            header: "% 1 Booster",
            accessorFn: (item: any) => item.adol.perc_booster1.toFixed(1),
          },
        ],
      },
    ],
  },
  {
    name: "Children",
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
        id: "children",
        header: "Children",
        columns: [
          {
            id: "child.perc_dose1",
            header: "% 1 Dose",
            accessorFn: (item: any) => item.child.perc_dose1.toFixed(1),
          },
          {
            id: "child.perc_dose2",
            header: "% 2 Doses",
            accessorFn: (item: any) => item.child.perc_dose2.toFixed(1),
          },
          {
            id: "child.perc_booster1",
            header: "% 1 Booster",
            accessorFn: (item: any) => item.child.perc_booster1.toFixed(1),
          },
        ],
      },
    ],
  },
];
