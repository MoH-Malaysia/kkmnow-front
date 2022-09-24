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
      accessorKey: "district",
      id: "district",
    },
    {
      header: "Sector",
      accessorKey: "sector",
      id: "sector",
    },
    {
      header: "Type",
      accessorKey: "type",
      id: "type",
    },
    {
      header: "Name",
      accessorKey: "name",
      id: "name",
    },
    {
      header: "Address",
      accessorKey: "add",
      id: "add",
    },
    {
      header: "Telephone",
      accessorKey: "phone",
      id: "phone",
    },
  ],
};
