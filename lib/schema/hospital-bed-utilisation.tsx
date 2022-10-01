import Image from "next/image";
import { CountryAndStates } from "@lib/constants";
export const HOSPITAL_TABLE_SCHEMA = (onClick?: (item: any) => void) => [
  {
    header: "State",
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
    header: "Name",
    accessorKey: "data.hospital",
    id: "data.hospital",
    sortDescFirst: true,
    cell: (item: any) => (
      <div className="text-left">
        <span
          className="hover:underline"
          onClick={() =>
            onClick &&
            onClick({ state: item.row.original.state, facility: item.row.original.data.hospital })
          }
        >
          {item.getValue()}
        </span>
      </div>
    ),
  },
  {
    header: "Hospital Beds",
    subheader: "Non-critical care",
    accessorKey: "data.beds_nonicu",
    id: "beds_nonicu",
    sortDescFirst: true,
  },
  {
    header: "ICU Beds",
    subheader: "Critical care",
    accessorKey: "data.beds_icu",
    id: "name",
    sortDescFirst: true,
  },
  {
    header: "Hospital Bed Utilisation",
    accessorFn: (item: any) => item.data.util_nonicu && +item.data.util_nonicu.toFixed(1),
    id: "util_nonicu",
    sortDescFirst: true,
    scale: true,
    unit: "%",
  },
  {
    header: "ICU Bed Utilisation",
    accessorFn: (item: any) => item.data.util_icu && +item.data.util_icu.toFixed(1),
    id: "util_icu",
    scale: true,
    unit: "%",
  },
];
