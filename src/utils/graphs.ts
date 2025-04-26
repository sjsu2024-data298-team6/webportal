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
    x: models,
    y: iouScores,
    type: "bar",
    marker: {
      color: "rgba(55,128,191,0.6)",
      line: {
        color: "rgba(55,128,191,1.0)",
        width: 1,
      },
    },
  };

  const layout: Partial<Layout> = {
    title: "IoU per Model",
    xaxis: {
      title: "Model",
      tickangle: -90,
    },
    yaxis: {
      title: "IoU",
    },
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
    x: models,
    y: map50Scores,
    name: "mAP50",
    type: "bar",
    marker: {
      color: "rgba(219,64,93,0.6)",
      line: {
        color: "rgba(219,64,93,1.0)",
        width: 1,
      },
    },
  };

  const trace2: Data = {
    x: models,
    y: map5095Scores,
    name: "mAP50-95",
    type: "bar",
    marker: {
      color: "rgba(93,164,214,0.6)",
      line: {
        color: "rgba(93,164,214,1.0)",
        width: 1,
      },
    },
  };

  const layout: Partial<Layout> = {
    title: "mAP per Model",
    xaxis: {
      title: "Model",
      tickangle: -90,
    },
    yaxis: {
      title: "mAP",
    },
    barmode: "group",
  };

  return { data: [trace1, trace2], layout };
};

export const createInferenceTimePerModelGraph = (
  data: ModelData[],
): { data: Data[]; layout: Partial<Layout> } => {
  const models = data.map((d) => d.modelName);
  const inferenceTimes = data.map((d) => d.inferenceTime);

  const trace: Data = {
    x: models,
    y: inferenceTimes,
    type: "bar",
    marker: {
      color: "rgba(180,180,180,0.6)",
      line: {
        color: "rgba(180,180,180,1.0)",
        width: 1,
      },
    },
  };

  const layout: Partial<Layout> = {
    title: "Inference Time per Model",
    xaxis: {
      title: "Model",
      tickangle: -90,
    },
    yaxis: {
      title: "Inference Time (ms)",
    },
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
    title: "Inference Time vs IoU per Model",
    xaxis: {
      title: "Inference Time (ms)",
    },
    yaxis: {
      title: "IoU",
    },
    hovermode: "closest",
    showlegend: true,
  };

  return { data: traces, layout };
};
