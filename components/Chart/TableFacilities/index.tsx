import { Search, StateDropdown, Dropdown } from "@components/index";
import { FunctionComponent, useMemo, useState, ReactElement } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
  FilterFn,
  isRowSelected,
} from "@tanstack/react-table";
import {
  SwitchVerticalIcon,
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/solid";
import { CountryAndStates } from "@lib/constants";
import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { OptionType } from "@components/types";

interface TableFacilitiesProps {
  className?: string;
  title?: string;
  menu?: ReactElement;
  data?: any;
  config?: Array<ColumnDef<Record<string, any>>>;
  filter?: boolean;
  pagination?: boolean;
  currentState?: string;
  state_district_mapping: any;
  facility_types: any;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const TableFacilities: FunctionComponent<TableFacilitiesProps> = ({
  className = "",
  title,
  menu,
  data = dummy,
  config = dummyConfig,
  filter = false,
  pagination = false,
  currentState = "",
  state_district_mapping,
  facility_types,
}) => {
  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => config, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    currentState === "mys" ? [] : [{ id: "state", value: currentState }]
  );

  const [typeFilter, setTypeFilter] = useState<OptionType>();
  const [stateFilter, setStateFilter] = useState(currentState);
  const [districtFilter, setDistrictFilter] = useState<OptionType>();

  const sortTooltip = (sortDir: "asc" | "desc" | false) => {
    if (sortDir === false) return "Sort";
    else if (sortDir === "desc") return "Desc order";
    else if (sortDir === "asc") return "Asc order";

    return undefined;
  };

  const isFilterEmpty = () => {
    return globalFilter.length != 0 || columnFilters.length != 0;
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  return (
    <div className="flex flex-col">
      {filter && (
        <div className="flex flex-row flex-wrap items-center gap-2">
          <StateDropdown
            currentState={stateFilter}
            label="State"
            onChange={selected => {
              setStateFilter(selected.value);
              setDistrictFilter(undefined);
              setTypeFilter(undefined);
              setColumnFilters([{ id: "state", value: selected.value }]);
            }}
            exclude={["kvy"]}
          />
          <Dropdown
            selected={districtFilter}
            placeholder="All"
            label="District"
            options={
              stateFilter != "mys"
                ? state_district_mapping[stateFilter].map((district: any) => {
                    return { label: district, value: district } as OptionType<string, string>;
                  })
                : []
            }
            onChange={selected => {
              setDistrictFilter(selected);
              setColumnFilters(columnFilters.concat({ id: "district", value: selected.value }));
            }}
          />
          <Dropdown
            selected={typeFilter}
            placeholder="All"
            label="Type"
            options={facility_types.map((fac: any) => {
              return { label: fac, value: fac } as OptionType<string, string>;
            })}
            onChange={selected => {
              setTypeFilter(selected);
              setColumnFilters(columnFilters.concat({ id: "type", value: selected.label }));
            }}
          />
          {isFilterEmpty() && (
            <div
              className="flex cursor-pointer flex-row items-center gap-2 text-dim"
              onClick={() => {
                setColumnFilters([]);
                setGlobalFilter("");
                setStateFilter("");
                setDistrictFilter(undefined);
                setTypeFilter(undefined);
              }}
            >
              <svg
                width="12"
                height="16"
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 3.75V0.75L2.25 4.5L6 8.25V5.25C8.4825 5.25 10.5 7.2675 10.5 9.75C10.5 12.2325 8.4825 14.25 6 14.25C3.5175 14.25 1.5 12.2325 1.5 9.75H0C0 13.065 2.685 15.75 6 15.75C9.315 15.75 12 13.065 12 9.75C12 6.435 9.315 3.75 6 3.75Z"
                  fill="#898989"
                />
              </svg>
              Clear filters
            </div>
          )}
          {/* <div className="ml-auto text-right">
            <Search
              query={globalFilter ?? ""}
              onChange={value => setGlobalFilter(String(value))}
            ></Search>
          </div> */}
        </div>
      )}
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
                  {row.getVisibleCells().map(cell => {
                    const lastCellInGroup = cell.column.parent
                      ? cell.column.parent?.columns[cell.column.parent?.columns.length - 1]
                      : cell.column;
                    return (
                      <td
                        key={cell.id}
                        className={`${cell.row.original.state === "mys" ? "bg-washed" : ""} ${
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
        {pagination && (
          <div className="mt-5 flex items-center justify-center gap-4 text-sm">
            <button
              className="flex flex-row gap-2 rounded border py-1 px-2 disabled:bg-slate-100 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeftIcon className="h-5 w-4 text-dim" />
              Previous
            </button>

            <span className="flex items-center gap-1 text-sm">
              <div>Page</div>
              <strong>{table.getState().pagination.pageIndex + 1}</strong> of {table.getPageCount()}
            </span>
            <button
              className="flex flex-row gap-2 rounded border py-1 px-2 disabled:bg-slate-100 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <ArrowRightIcon className="h-5 w-4 text-dim" />
            </button>
          </div>
        )}
      </div>
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

export default TableFacilities;
