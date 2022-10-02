import { SetStateAction } from "react";
import { OptionType } from "@components/types";
import { TFunction } from "next-i18next";
import uniqueId from "lodash/uniqueId";
import { DateTime } from "luxon";

export const isObjEqual = (obj1: any, obj2: any) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const isObjInArr = (arr: any[], obj: any) => {
  return arr.some((item: any) => isObjEqual(item, obj));
};

/**
 * Returns the object of max value by a given key in the array.
 * @param array Object array
 * @param key Comparing key
 * @returns Object
 */
export const maxBy = (array: Array<any>, key: string) => {
  return array.reduce((prev, current) => {
    return prev[key] > current[key] ? prev : current;
  });
};

/**
 * Find max or limit to 100 if above.
 * @param e number
 * @returns max || 100
 */
export const minMax = (e: number) => {
  if (!e) return 0;
  return Math.min(Math.max(e, 0), 100);
};

/**
 * Genearate a uuid.
 * @returns uuid string
 */
export const uuid = () => uniqueId();

/**
 * Format a number to the given type.
 * @param value number
 * @param type Intl format type
 * @returns string
 */
export const numFormat = (value: number, type?: any): string => {
  const formatter = Intl.NumberFormat("en", {
    notation: type ? type : "compact",
    maximumFractionDigits: 1,
  });
  return formatter.format(value);
};

/**
 * Returns a date string from epoch millis.
 * @param millis Epock millis
 * @returns Date string
 */
export const toDate = (millis: number) => DateTime.fromMillis(millis).toFormat("dd MMM yyyy");

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
