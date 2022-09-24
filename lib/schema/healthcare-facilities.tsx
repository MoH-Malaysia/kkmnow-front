import { CountryAndStates } from "@lib/constants";

export const FACILTIES_TABLE_SCHEMA = {
  config: [
    {
      header: "State",
      id: "state",
      accessorKey: "state",
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
      header: "District",
      accessorKey: "data.district",
      id: "district",
    },
    {
      header: "Sector",
      accessorKey: "data.sector",
      id: "sector",
    },
    {
      header: "Type",
      accessorKey: "data.type",
      id: "type",
    },
    {
      header: "Name",
      accessorKey: "data.name",
      id: "name",
    },
    {
      header: "Address",
      accessorKey: "data.address",
      id: "address",
    },
    {
      header: "Telephone",
      accessorKey: "data.phone",
      id: "phone",
    },
  ],
};
