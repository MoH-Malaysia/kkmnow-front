import { CountryAndStates } from "@lib/constants";
import { useTranslation } from "next-i18next";
import Image from "next/image";

export const VACCINE_TABLE_SCHEMA = () => {
  const { t } = useTranslation();
  return [
    {
      name: t("vaccination.tab_table1"),
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
          id: "total",
          header: t("vaccination.tab_table2"),
          columns: [
            {
              id: "total.perc_dose1",
              header: t("vaccination.table_1dose"),
              sortDescFirst: true,
              accessorFn: (item: any) => item.total.perc_dose1.toFixed(1),
            },
            {
              id: "total.perc_dose2",
              header: t("vaccination.table_2dose"),
              accessorFn: (item: any) => item.total.perc_dose2.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "total.perc_booster1",
              header: t("vaccination.table_1boost"),
              accessorFn: (item: any) => item.total.perc_booster1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "total.perc_booster2",
              header: t("vaccination.table_2boost"),
              accessorFn: (item: any) => item.total.perc_booster2.toFixed(1),
              sortDescFirst: true,
            },
          ],
        },
        {
          id: "adult",
          header: t("vaccination.tab_table3"),
          columns: [
            {
              id: "adult.perc_dose1",
              header: t("vaccination.table_1dose"),
              accessorFn: (item: any) => item.adult.perc_dose1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adult.perc_dose2",
              header: t("vaccination.table_2dose"),
              accessorFn: (item: any) => item.adult.perc_dose2.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adult.perc_booster1",
              header: t("vaccination.table_1boost"),
              accessorFn: (item: any) => item.adult.perc_booster1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adult.perc_booster2",
              header: t("vaccination.table_2boost"),
              accessorFn: (item: any) => item.adult.perc_booster2.toFixed(1),
              sortDescFirst: true,
            },
          ],
        },
        {
          id: "adolescent",
          header: t("vaccination.tab_table4"),
          columns: [
            {
              id: "adol.perc_dose1",
              header: t("vaccination.table_1dose"),
              accessorFn: (item: any) => item.adol.perc_dose1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adol.perc_dose2",
              header: t("vaccination.table_2dose"),
              accessorFn: (item: any) => item.adol.perc_dose2.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "perc_booster1",
              header: t("vaccination.table_1boost"),
              accessorFn: (item: any) => item.adol.perc_booster1.toFixed(1),
              sortDescFirst: true,
            },
          ],
        },
        {
          id: "children",
          header: t("vaccination.tab_table5"),
          columns: [
            {
              id: "child.perc_dose1",
              header: t("vaccination.table_1dose"),
              accessorFn: (item: any) => item.child.perc_dose1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "child.perc_dose2",
              header: t("vaccination.table_2dose"),
              accessorFn: (item: any) => item.child.perc_dose2.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "child.perc_booster1",
              header: t("vaccination.table_1boost"),
              accessorFn: (item: any) => item.child.perc_booster1.toFixed(1),
              sortDescFirst: true,
            },
          ],
        },
      ],
    },
    {
      name: t("vaccination.tab_table2"),
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
          id: "total",
          header: t("vaccination.tab_table2"),
          columns: [
            {
              id: "total.perc_dose1",
              header: t("vaccination.table_1dose"),
              accessorFn: (item: any) => item.total.perc_dose1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "total.perc_dose2",
              header: t("vaccination.table_2dose"),
              accessorFn: (item: any) => item.total.perc_dose2.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "total.perc_booster1",
              header: t("vaccination.table_1boost"),
              accessorFn: (item: any) => item.total.perc_booster1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "total.perc_booster2",
              header: t("vaccination.table_2boost"),
              accessorFn: (item: any) => item.total.perc_booster2.toFixed(1),
              sortDescFirst: true,
            },
          ],
        },
      ],
    },
    {
      name: t("vaccination.tab_table3"),
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
          id: "adult",
          header: t("vaccination.tab_table3"),
          columns: [
            {
              id: "adult.perc_dose1",
              header: t("vaccination.table_1dose"),
              accessorFn: (item: any) => item.adult.perc_dose1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adult.perc_dose2",
              header: t("vaccination.table_2dose"),
              accessorFn: (item: any) => item.adult.perc_dose2.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adult.perc_booster1",
              header: t("vaccination.table_1boost"),
              accessorFn: (item: any) => item.adult.perc_booster1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adult.perc_booster2",
              header: t("vaccination.table_2boost"),
              accessorFn: (item: any) => item.adult.perc_booster2.toFixed(1),
              sortDescFirst: true,
            },
          ],
        },
      ],
    },
    {
      name: t("vaccination.tab_table4"),
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
          id: "adolescent",
          header: "Adolescents",
          columns: [
            {
              id: "adol.perc_dose1",
              header: t("vaccination.table_1dose"),
              accessorFn: (item: any) => item.adol.perc_dose1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adol.perc_dose2",
              header: t("vaccination.table_2dose"),
              accessorFn: (item: any) => item.adol.perc_dose2.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "adol.perc_booster1",
              header: t("vaccination.table_1boost"),
              accessorFn: (item: any) => item.adol.perc_booster1.toFixed(1),
              sortDescFirst: true,
            },
          ],
        },
      ],
    },
    {
      name: t("vaccination.tab_table5"),
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
          id: "children",
          header: t("vaccination.tab_table5"),
          columns: [
            {
              id: "child.perc_dose1",
              header: t("vaccination.table_1dose"),
              accessorFn: (item: any) => item.child.perc_dose1.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "child.perc_dose2",
              header: t("vaccination.table_2dose"),
              accessorFn: (item: any) => item.child.perc_dose2.toFixed(1),
              sortDescFirst: true,
            },
            {
              id: "child.perc_booster1",
              header: t("vaccination.table_1boost"),
              accessorFn: (item: any) => item.child.perc_booster1.toFixed(1),
              sortDescFirst: true,
            },
          ],
        },
      ],
    },
  ];
};
