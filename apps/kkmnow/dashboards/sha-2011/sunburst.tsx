import { ResponsiveSunburst } from "@nivo/sunburst";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { useTheme } from "next-themes";
import { FunctionComponent } from "react";
import type { Hierarchy } from "./colors";

type Node = { id: string; value?: number; children?: Node[] };

interface SunburstProps {
  className?: string;
  /** Leaf code -> value; intermediate parents are filled in from the classification */
  leaves: Record<string, number>;
  parent: Hierarchy["parent"];
  /** Official notation for the arc labels, e.g. HP.1.1 */
  notation: Hierarchy["sha"];
  color: (code: string) => string;
  label: (code: string) => string;
  format: (value: number) => string;
}

/** Build the code hierarchy, adding parents that have no value of their own */
const buildTree = (leaves: Record<string, number>, parent: Hierarchy["parent"]): Node => {
  const nodes: Record<string, Node> = { total: { id: "total", children: [] } };
  const ensure = (code: string): Node => {
    if (nodes[code]) return nodes[code];
    const node: Node = { id: code, children: [] };
    nodes[code] = node;
    ensure(parent(code) ?? "total").children!.push(node);
    return node;
  };
  Object.entries(leaves).forEach(([code, value]) => {
    const node = ensure(code);
    node.value = Math.max(value, 0);
    delete node.children;
  });
  return nodes.total;
};

/**
 * Hierarchy sunburst, innermost ring = level 1.
 */
const Sunburst: FunctionComponent<SunburstProps> = ({
  className = "h-[560px] w-full",
  leaves,
  parent,
  notation,
  color,
  label,
  format,
}) => {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className={className}>
      <ResponsiveSunburst<Node>
        data={buildTree(leaves, parent)}
        id="id"
        value="value"
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        cornerRadius={2}
        borderWidth={2}
        borderColor={dark ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE}
        colors={node => color(String(node.id))}
        inheritColorFromParent={false}
        enableArcLabels
        arcLabel={node => (node.percentage >= 6 ? notation(String(node.id)) : "")}
        arcLabelsTextColor={AKSARA_COLOR.WHITE}
        theme={{ fontFamily: "Inter", fontSize: 11 }}
        tooltip={node => (
          <div className="rounded-md bg-black px-3 py-2 text-sm text-white shadow">
            <strong>{label(String(node.id))}</strong>
            <br />
            {format(node.value)} · {node.percentage.toFixed(1)}%
          </div>
        )}
      />
    </div>
  );
};

export default Sunburst;
