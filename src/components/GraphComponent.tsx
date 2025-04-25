import React from "react";
import dynamic from "next/dynamic";
import { Data, Layout } from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface GraphProps {
  data: Data[];
  layout: Partial<Layout>;
}

const GraphComponent: React.FC<GraphProps> = ({ data, layout }) => {
  return (
    <Plot
      data={data}
      layout={{
        ...layout,
        autosize: true,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
    />
  );
};

export default GraphComponent;
