import Link from "next/link";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { XIcon } from "@heroicons/react/solid";

import {
  intervalOptions,
  geographyOptions,
  dataStartOptions,
  dataEndOptions,
  dataSourceOptions,
} from "@lib/options";
import { handleSelectMultipleDropdown } from "@lib/helpers";

import { OptionType } from "@components/types";

import Hero from "@components/Hero";
import Search from "@components/Search";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";

const Catalogue: NextPage = () => {
  // SEARCH BAR
  const [query, setQuery] = useState<string>();

  // FILTERS
  const [isDefaultFilters, setIsDefaultFilters] = useState(true);

  const [interval, setInterval] = useState({
    label: intervalOptions[0],
    value: intervalOptions[0],
  });

  const [geography, setGeography] = useState<OptionType[]>([]);

  const [dataStart, setDataStart] = useState<OptionType<number, number>>({
    label: dataStartOptions[0],
    value: dataStartOptions[0],
  });

  const [dataEnd, setDataEnd] = useState<OptionType<number, number>>({
    label: dataEndOptions[0],
    value: dataEndOptions[0],
  });

  const [dataSource, setDataSource] = useState<OptionType[]>([]);

  const exampleCatalogCategories = ["Health", "Transport", "Geography", "Education"];

  const exampleCatalogData = Array(4)
    .fill(0)
    .map((_, i) => ({
      title: exampleCatalogCategories[i],
      datasets: Array(14).fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit"),
    }));

  const handleClearFilters = () => {
    setInterval({
      label: intervalOptions[0],
      value: intervalOptions[0],
    });
    setGeography([]);
    setDataStart({
      label: dataStartOptions[0],
      value: dataStartOptions[0],
    });
    setDataEnd({
      label: dataEndOptions[0],
      value: dataEndOptions[0],
    });
    setDataSource([]);
  };

  useEffect(() => {
    if (
      interval.value === intervalOptions[0] &&
      geography.length === 0 &&
      dataStart.value === dataStartOptions[0] &&
      dataEnd.value === dataEndOptions[0] &&
      dataSource.length === 0
    ) {
      setIsDefaultFilters(true);
    } else {
      setIsDefaultFilters(false);
    }
  }, [interval, geography, dataStart, dataEnd, dataSource]);

  return (
    <>
      <Hero background="hero-light-1">
        <h3 className="mb-2">Data Catalogue</h3>
        <p className="max-w-3xl text-dim">
          Your one-stop interface to browse Malaysia's wealth of open data. This page documents not
          just the data used on AKSARA, but all open data from all Malaysian government agencies.
        </p>
      </Hero>
      <Container className="min-h-screen pb-5">
        {/* SEARCH BAR & FILTERS */}
        <div className="sticky top-[56px] flex items-center justify-between border-b border-outline bg-white py-2">
          <Search query={query} onChange={(query?: string) => setQuery(query)} />
          <div className="flex items-center gap-2">
            {isDefaultFilters ? (
              <p className="text-sm text-dim">Filters: </p>
            ) : (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-sm text-dim focus:outline-none focus:ring-0"
              >
                <XIcon className="h-4 w-4" />
                <span>Clear</span>
              </button>
            )}
            <Dropdown
              selected={interval}
              onChange={setInterval}
              options={intervalOptions.map(option => ({
                label: option,
                value: option,
              }))}
              width="w-40"
            />
            <Dropdown
              multiple={true}
              title="Geography"
              selected={geography}
              onChange={(option: OptionType) =>
                handleSelectMultipleDropdown(option, geography, setGeography)
              }
              clearSelected={() => setGeography([])}
              options={geographyOptions.map(option => ({
                label: option,
                value: option,
              }))}
              width="w-40"
            />
            <Dropdown<number, number>
              description="Dataset begins from"
              selected={dataStart}
              onChange={setDataStart}
              options={dataStartOptions.map(option => ({
                label: option,
                value: option,
              }))}
              width="w-40"
            />
            <Dropdown<number, number>
              description="Most recent datapoint"
              selected={dataEnd}
              onChange={setDataEnd}
              options={dataEndOptions.map(option => ({
                label: option,
                value: option,
              }))}
              width="w-40"
            />
            <Dropdown
              multiple={true}
              title="Data source"
              selected={dataSource}
              onChange={(option: OptionType) =>
                handleSelectMultipleDropdown(option, dataSource, setDataSource)
              }
              clearSelected={() => setDataSource([])}
              options={dataSourceOptions.map(option => ({
                label: option,
                value: option,
              }))}
              width="w-40"
            />
          </div>
        </div>
        {/* CATALOG */}
        <div className="divide-y border-b border-outline">
          {exampleCatalogData.map((catalog, catalogIndex) => {
            return (
              <div key={catalogIndex} className="py-6">
                <p className="mb-2 font-bold">{catalog.title}</p>
                <li className="grid grid-cols-1 gap-y-1 md:grid-cols-2 xl:grid-cols-3">
                  {catalog.datasets.map((dataset, datasetIndex) => (
                    <Link href="/" key={datasetIndex}>
                      <ul className="text-link">
                        {(datasetIndex + 1).toString().padStart(2, "0")} {dataset}
                      </ul>
                    </Link>
                  ))}
                </li>
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
};

export default Catalogue;
