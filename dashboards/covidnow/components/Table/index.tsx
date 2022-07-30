import { FunctionComponent, useReducer, useMemo, useState, ReactElement } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { SwitchVerticalIcon, ArrowSmUpIcon, ArrowSmDownIcon } from "@heroicons/react/solid";

interface TableProps {
  className?: string;
  title?: string;
  menu?: ReactElement;
}

const Table: FunctionComponent<TableProps> = ({ className = "", title, menu }) => {
  const rerender = useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => [
      {
        header: "",
        id: "state",
        accessorKey: "state",
        enableSorting: false,
        cell: item => {
          const state = item.getValue();
          return (
            <div className="flex items-center gap-3">
              <img className="h-4 w-7" src={`/static/images/states/${state}.jpeg`}></img>
              <span>{statesMap[state]}</span>
            </div>
          );
        },
      },
      {
        id: "total",
        header: "Total",
        columns: [
          {
            id: "total.perc_1dose",
            header: "% 1 Dose",
            accessorFn: item => item.total.perc_1dose,
          },
          {
            id: "total.perc_2dose",
            header: "% 2 Doses",
            accessorFn: item => item.total.perc_2dose,
          },
          {
            id: "perc_1booster",
            header: "% 1 Booster",
            accessorFn: item => item.total.perc_1booster,
          },
        ],
      },
      {
        id: "adult",
        header: "Adults",
        columns: [
          {
            id: "adult.perc_1dose",
            header: "% 1 Dose",
            accessorFn: item => item.adult.perc_1dose,
          },
          {
            id: "adult.perc_2dose",
            header: "% 2 Doses",
            accessorFn: item => item.adult.perc_2dose,
          },
          {
            id: "adult.perc_1booster",
            header: "% 1 Booster",
            accessorFn: item => item.adult.perc_1booster,
          },
        ],
      },
      {
        id: "adolescent",
        header: "Adolescent",
        columns: [
          {
            id: "adolescent.perc_1dose",
            header: "% 1 Dose",
            accessorFn: item => item.adolescent.perc_1dose,
          },
          {
            id: "adolescent.perc_2dose",
            header: "% 2 Doses",
            accessorFn: item => item.adolescent.perc_2dose,
          },
        ],
      },
      {
        id: "children",
        header: "Children",
        columns: [
          {
            id: "children.perc_1dose",
            header: "% 1 Dose",
            accessorFn: item => item.children.perc_1dose,
          },
          {
            id: "children.perc_2dose",
            header: "% 2 Doses",
            accessorFn: item => item.children.perc_2dose,
          },
        ],
      },
    ],
    []
  );

  const sortTooltip = (sortDir: "asc" | "desc" | false) => {
    if (sortDir === false) return "Sort";
    else if (sortDir === "desc") return "Desc order";
    else if (sortDir === "asc") return "Asc order";

    return undefined;
  };

  const [data, setData] = useState(dummy);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <div className="table-responsive">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <span className="text-base font-bold">{title ?? ""}</span>
        {menu && <div className="flex items-center justify-end gap-2">{menu}</div>}
      </div>
      <table className={`table${className}`}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex gap-2 justify-center"
                            : "text-black font-bold",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        <span
                          className="inline-block"
                          title={sortTooltip(header.column.getIsSorted())}
                        >
                          {{
                            asc: <ArrowSmUpIcon className="inline-block h-4 w-auto text-black" />,
                            desc: (
                              <ArrowSmDownIcon className="inline-block h-4 w-auto text-black" />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                          {header.column.getCanSort() && !header.column.getIsSorted() ? (
                            <SwitchVerticalIcon className="inline-block h-4 w-auto text-dim" />
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const lastCellInGroup = cell.column.parent
                    ? cell.column.parent?.columns[cell.column.parent?.columns.length - 1]
                    : cell.column;
                  return (
                    <td
                      key={cell.id}
                      className={`${cell.row.original.hightlight ? "bg-washed" : ""} ${
                        lastCellInGroup.id === cell.column.id ? "border-r-black" : ""
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const statesMap = {
  jhr: "Johor",
  kdh: "Kedah",
  ktn: "Kelantan",
  kul: "Kuala Lumpur",
  kvy: "Klang Valley",
  lbn: "Labuan",
  mlk: "Melaka",
  mys: "Malaysia",
  nsn: "N.Sembilan",
  phg: "Pahang",
  pjy: "Putrajaya",
  pls: "Perlis",
  png: "P.Pinang",
  prk: "Perak",
  sbh: "Sabah",
  sgr: "Selangor",
  swk: "Sarawak",
  trg: "Terengganu",
  wp: "W.Persekutuan",
};

const dummy = Array(19)
  .fill(0)
  .map((_, index) => {
    const state = Object.keys(statesMap)[index];
    return {
      id: index,
      state: state,
      total: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
        perc_1booster: Math.floor(Math.random() * 10) + 1,
      },
      adult: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
        perc_1booster: Math.floor(Math.random() * 10) + 1,
      },
      adolescent: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
      },
      children: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
      },
      hightlight: state === "mys",
    };
  });

export default Table;
