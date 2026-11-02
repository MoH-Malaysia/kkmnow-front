import { Chart as ChartJS } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

/*
 * datagovmy-ui's Heatmap registers chartjs-plugin-datalabels globally while it renders. Charts
 * created before that never ran the plugin's init hook, so their next draw throws
 * "Cannot read properties of undefined (reading '_labels')", and charts created after it would
 * all draw value labels. Register it once, before any chart on this page exists, with labels
 * off by default; Heatmap still turns them on in its own options.
 */
ChartJS.register(ChartDataLabels);
ChartJS.defaults.set("plugins.datalabels", { display: false });
