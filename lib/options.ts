export const languages = [
  { label: "English", value: "en-GB" },
  { label: "Malay", value: "ms-MY" },
];

// TODO (@itschrislow): update example options for filters in data catalog page
export const intervalOptions = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
  "No fixed cadence",
];

export const geographyOptions = ["National", "State", "District", "Mukim", "Parliament", "DUN"];

export const dataStartOptions = Array(15)
  .fill(0)
  .map((_, i) => 1990 + i)
  .reverse();

export const dataEndOptions = Array(15)
  .fill(0)
  .map((_, i) => 2020 + i);

export const dataSourceOptions = ["DOSM", "Ministry of Health", "Ministry of Transport", "MoSTI"];

export const filterDoseOptions = [
  { label: "Total Population", value: "total" },
  { label: "Children (5-11)", value: "children" },
  { label: "Adolescents (12-17)", value: "adolescent" },
  { label: "Adults (18+)", value: "adult" },
  { label: "Elderly (60+)", value: "elderly" },
];

export const filterAgeOptions = [
  { label: "1st Dose", value: "1st_dose" },
  { label: "2nd Dose", value: "2nd_dose" },
  { label: "1st Booster", value: "1st_booster" },
  { label: "2nd Booster", value: "2nd_booster" },
];
