import {
  CHOROPLETH_METRICS,
  CHOROPLETH_RED_SCALE,
  CHOROPLETH_GREEN_SCALE,
  CHOROPLETH_BLUE_SCALE,
  CHOROPLETH_YELLOW_GREEN_BLUE_SCALE,
  CHOROPLETH_RED_PURPLE_SCALE,
} from "./constants";

export const getChoroplethColors = (choropleth: CHOROPLETH_METRICS) => {
  if (
    choropleth === CHOROPLETH_METRICS.MaxElevation ||
    choropleth === CHOROPLETH_METRICS.Ruggedness ||
    choropleth === CHOROPLETH_METRICS.Treeloss ||
    choropleth === CHOROPLETH_METRICS.Gini ||
    choropleth === CHOROPLETH_METRICS.Poverty
  ) {
    // reds
    return CHOROPLETH_RED_SCALE;
  } else if (choropleth === CHOROPLETH_METRICS.Treecover) {
    // greens
    return CHOROPLETH_GREEN_SCALE;
  } else if (choropleth === CHOROPLETH_METRICS.Water) {
    // blues
    return CHOROPLETH_BLUE_SCALE;
  } else if (
    choropleth === CHOROPLETH_METRICS.Nightlights ||
    choropleth === CHOROPLETH_METRICS.Electricity
  ) {
    // yellow_green_blue
    return CHOROPLETH_YELLOW_GREEN_BLUE_SCALE;
  } else {
    // red_purple
    return CHOROPLETH_RED_PURPLE_SCALE;
  }
};

export const getChoroplethBorderColor = (choropleth: CHOROPLETH_METRICS) => {
  if (choropleth === CHOROPLETH_METRICS.Electricity) {
    // dark border
    return "#636161";
  } else {
    // light border
    return "#f2f2f2";
  }
};
