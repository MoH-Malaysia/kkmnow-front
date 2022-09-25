import { FunctionComponent, useMemo, useState, ReactElement } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { SwitchVerticalIcon, ArrowSmUpIcon, ArrowSmDownIcon } from "@heroicons/react/solid";
import { CountryAndStates } from "@lib/constants";
import { useEffect } from "react";

interface TableProps {
  className?: string;
  title?: string;
  menu?: ReactElement;
  data?: any;
  config?: Array<ColumnDef<Record<string, any>>>;
  isPagination?: boolean;
}

const Table: FunctionComponent<TableProps> = ({
  className = "",
  title,
  menu,
  data = dummy,
  config = dummyConfig,
  isPagination = false,
}) => {
  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => config, []);
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortTooltip = (sortDir: "asc" | "desc" | false) => {
    if (sortDir === false) return "Sort";
    else if (sortDir === "desc") return "Desc order";
    else if (sortDir === "asc") return "Asc order";

    return undefined;
  };
  console.log(dummy);
  const ReactTableProps: any = {
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  };

  !isPagination
    ? ReactTableProps.getPaginationRowModel == null
    : (ReactTableProps.getPaginationRowModel = getPaginationRowModel());

  const table = useReactTable(ReactTableProps);

  useEffect(() => {
    isPagination ? table.setPageSize(10) : null;
  }, []);

  return (
    <div className="table-responsive">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <span className="text-base font-bold">{title ?? ""}</span>
        {menu && <div className="flex items-center justify-end gap-2">{menu}</div>}
      </div>
      <table className={`table ${className}`}>
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
                            ? "cursor-pointer select-none flex gap-1 text-sm justify-center "
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
                {row.getVisibleCells().map((cell: any) => {
                  const lastCellInGroup = cell.column.parent
                    ? cell.column.parent?.columns[cell.column.parent?.columns.length - 1]
                    : cell.column;
                  return (
                    <td
                      key={cell.id}
                      className={`${cell.row.original.highlight ? "bg-washed" : ""} ${
                        lastCellInGroup.id === cell.column.id ? "text xs border-r-black" : ""
                      }`}
                    >
                      <span className="text-sm lg:text-base">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {isPagination ? (
        <>
          <div className="my-4 flex w-full items-center justify-center gap-2">
            <button
              className="rounded border p-1 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<- Previous"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>
            <button
              className="rounded border p-1 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {"Next ->"}
            </button>

            {/* <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 rounded border p-1"
              />
            </span> */}
            {/* <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select> */}
          </div>
        </>
      ) : null}
    </div>
  );
};

const dummyConfig = [
  {
    header: "",
    id: "state",
    accessorKey: "state",
    enableSorting: false,
    cell: (item: any) => {
      const state = item.getValue() as string;
      return (
        <div className="flex items-center gap-3">
          <img className="h-4 w-7" src={`/static/images/states/${state}.jpeg`}></img>
          <span>{CountryAndStates[state]}</span>
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
        accessorFn: (item: any) => item.total.perc_1dose,
      },
      {
        id: "total.perc_2dose",
        header: "% 2 Doses",
        accessorFn: (item: any) => item.total.perc_2dose,
      },
      {
        id: "perc_1booster",
        header: "% 1 Booster",
        accessorFn: (item: any) => item.total.perc_1booster,
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
        accessorFn: (item: any) => item.adult.perc_1dose,
      },
      {
        id: "adult.perc_2dose",
        header: "% 2 Doses",
        accessorFn: (item: any) => item.adult.perc_2dose,
      },
      {
        id: "adult.perc_1booster",
        header: "% 1 Booster",
        accessorFn: (item: any) => item.adult.perc_1booster,
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
        accessorFn: (item: any) => item.adolescent.perc_1dose,
      },
      {
        id: "adolescent.perc_2dose",
        header: "% 2 Doses",
        accessorFn: (item: any) => item.adolescent.perc_2dose,
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
        accessorFn: (item: any) => item.children.perc_1dose,
      },
      {
        id: "children.perc_2dose",
        header: "% 2 Doses",
        accessorFn: (item: any) => item.children.perc_2dose,
      },
    ],
  },
];

const dummy = Array(Object.keys(CountryAndStates).length)
  .fill(0)
  .map((_, index) => {
    const state = Object.keys(CountryAndStates)[index];
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
      highlight: state === "mys",
    };
  });

export default Table;
