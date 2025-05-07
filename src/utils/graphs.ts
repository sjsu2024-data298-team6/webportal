import { Data, Layout } from "plotly.js";

export interface ModelData {
  modelName: string;
  iouScore: number;
  map50Score: number;
  map5095Score: number;
  inferenceTime: number;
}

export const createIoUPerModelGraph = (
  data: ModelData[],
): { data: Data[]; layout: Partial<Layout> } => {
  const models = data.map((d) => d.modelName);
  const iouScores = data.map((d) => d.iouScore);

  const trace: Data = {
    y: models,
    x: iouScores,
    type: "bar",
    orientation: "h",
    marker: {
      color: "rgba(55,128,191,0.6)",
      line: {
        color: "rgba(55,128,191,1.0)",
        width: 1,
      },
    },
  };

  const layout: Partial<Layout> = {
    title: {
      text: "IoU per Model",
    },
    xaxis: {
      title: { text: "IoU" },
    },
    margin: {
      l: 250,
    },
    autosize: true,
  };

  return { data: [trace], layout };
};

export const createMapPerModelGraph = (
  data: ModelData[],
): { data: Data[]; layout: Partial<Layout> } => {
  const models = data.map((d) => d.modelName);
  const map50Scores = data.map((d) => d.map50Score);
  const map5095Scores = data.map((d) => d.map5095Score);

  const trace1: Data = {
    y: models,
    x: map50Scores,
    name: "mAP50",
    type: "bar",
    orientation: "h",
    marker: {
      color: "rgba(219,64,93,0.6)",
      line: {
        color: "rgba(219,64,93,1.0)",
        width: 1,
      },
    },
  };

  const trace2: Data = {
    y: models,
    x: map5095Scores,
    name: "mAP50-95",
    type: "bar",
    orientation: "h",
    marker: {
      color: "rgba(93,164,214,0.6)",
      line: {
        color: "rgba(93,164,214,1.0)",
        width: 1,
      },
    },
  };

  const layout: Partial<Layout> = {
    title: { text: "mAP per Model" },
    xaxis: { title: { text: "mAP" } },
    barmode: "group",
    margin: {
      l: 250,
    },
    autosize: true,
  };

  return { data: [trace2, trace1], layout };
};

export const createInferenceTimePerModelGraph = (
  data: ModelData[],
): { data: Data[]; layout: Partial<Layout> } => {
  const models = data.map((d) => d.modelName);
  const inferenceTimes = data.map((d) => d.inferenceTime);

  const trace: Data = {
    y: models,
    x: inferenceTimes,
    type: "bar",
    orientation: "h",
    marker: {
      color: "rgba(180,180,180,0.6)",
      line: {
        color: "rgba(180,180,180,1.0)",
        width: 1,
      },
    },
  };

  const layout: Partial<Layout> = {
    title: { text: "Inference Time per Model" },
    xaxis: {
      title: { text: "Inference Time (ms)" },
    },
    margin: {
      l: 250,
    },
    autosize: true,
  };

  return { data: [trace], layout };
};

export const createInferenceTimeVsIoUGraph = (
  data: ModelData[],
): { data: Data[]; layout: Partial<Layout> } => {
  const traces: Data[] = data.map((d, index) => ({
    x: [d.inferenceTime],
    y: [d.iouScore],
    mode: "markers",
    type: "scatter",
    name: d.modelName,
    marker: {
      size: 10,
      color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`, // Use HSL color scheme
    },
  }));

  const layout: Partial<Layout> = {
    title: { text: "Inference Time vs IoU per Model" },
    xaxis: {
      title: { text: "Inference Time (ms)" },
    },
    yaxis: {
      title: { text: "IoU" },
    },
    hovermode: "closest",
    showlegend: true,
    autosize: true,
  };

  return { data: traces, layout };
};
