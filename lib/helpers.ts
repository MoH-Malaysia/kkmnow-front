import { SetStateAction } from "react";
import { OptionType } from "@components/types";
import { TFunction } from "next-i18next";

export const isObjEqual = (obj1: any, obj2: any) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const isObjInArr = (arr: any[], obj: any) => {
  return arr.some((item: any) => isObjEqual(item, obj));
};

export const maxBy = (array: Array<any>, key: string) => {
  return array.reduce((prev, current) => {
    return prev[key] > current[key] ? prev : current;
  });
};

export const minMax = (e: number) => {
  if (!e) return 0;
  return Math.min(Math.max(e, 0), 100);
};

export const handleSelectMultipleDropdown = (
  selectedOption: OptionType,
  options: OptionType[],
  useStateHookFunction: React.Dispatch<SetStateAction<OptionType[]>>
) => {
  if (options.some(o => isObjEqual(o, selectedOption))) {
    useStateHookFunction(options.filter(o => !isObjEqual(o, selectedOption)));
  } else {
    useStateHookFunction([...options, selectedOption]);
  }
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const formatNumberPrefix = (n: number) => {
  if (n > 999999) return `${(n / 1000000).toFixed(1)}M`;
  else return n > 999 ? `${(n / 1000).toFixed(0)}k` : n;
};

export const replaceChartIdWithTranslation = (t: TFunction, prefix: string, data: any[]) => {
  return data.map((item: any) => {
    return {
      ...item,
      id: t(`${prefix}${prefix ? "." : ""}${item.id}`),
    };
  });
};
