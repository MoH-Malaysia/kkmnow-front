import { AKSARA_COLOR } from "datagovmy-ui/constants";
import type { HierarchyEntry } from "./types";

// Validated categorical order (dataviz reference palette), stepped per theme
const CATEGORICAL = {
  light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"],
  dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"],
};

/**
 * Classification helpers for one dimension, from the hierarchy the pipeline publishes
 * (codes in classification order with their parents). Residual codes such as hf1nec or hfnec
 * don't follow the digit pattern, so nothing here parses code strings.
 */
export const hierarchy = (entries: HierarchyEntry[]) => {
  const parents = Object.fromEntries(entries.map(e => [e.code, e.parent]));
  const sha = Object.fromEntries(entries.map(e => [e.code, e.sha]));
  const parent = (code: string): string | null => parents[code] ?? null;
  const family = (code: string): string => {
    let top = code;
    while (parent(top)) top = parent(top)!;
    return top;
  };
  return {
    /** Level-1 codes in classification order */
    families: entries.filter(e => !e.parent).map(e => e.code),
    parent,
    family,
    /** Official SHA 2011 notation, e.g. hf1nec -> HF.1.nec */
    sha: (code: string): string => sha[code] ?? code.toUpperCase(),
  };
};

export type Hierarchy = ReturnType<typeof hierarchy>;

const mix = (hex: string, target: string, t: number) => {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(target.slice(1), 16);
  const ch = (shift: number) =>
    Math.round(((a >> shift) & 255) * (1 - t) + ((b >> shift) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

/**
 * Composite colour encoding: hue by level-1 family, lightness by position within it.
 * A code gets the same colour in every chart. Residual (n.e.c.) families and families past the
 * eighth fold into grey.
 *
 * @param h Hierarchy of the dimension
 * @param shown Codes drawn together, so siblings in one family get distinct steps
 */
export const colorScale = (h: Hierarchy, shown: string[], dark: boolean) => {
  const hues = CATEGORICAL[dark ? "dark" : "light"];
  const named = h.families.filter(f => !f.endsWith("nec"));
  const byFamily: Record<string, string[]> = {};
  shown.forEach(code => (byFamily[h.family(code)] ??= []).push(code));

  return (code: string): string => {
    const idx = named.indexOf(h.family(code));
    const base = idx >= 0 && idx < hues.length ? hues[idx] : AKSARA_COLOR.GREY;
    const members = byFamily[h.family(code)] ?? [];
    const i = members.indexOf(code);
    // Codes not drawn as their own series (e.g. sunburst parents) take the family hue
    if (i < 0 || members.length <= 1) return base;
    // Spread siblings from darker to lighter around the family hue
    const t = i / (members.length - 1) - 0.5; // -0.5 .. 0.5
    return t < 0 ? mix(base, "#000000", -t * 0.6) : mix(base, "#ffffff", t * 0.7);
  };
};
