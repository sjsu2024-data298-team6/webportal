import {
  createIoUPerModelGraph,
  createMapPerModelGraph,
  createInferenceTimePerModelGraph,
  createInferenceTimeVsIoUGraph,
  ModelData,
} from "@/utils/graphs";

import GraphComponent from "@/components/GraphComponent";

interface ModelResultGraphsProps {
  modelData: ModelData[];
}

const ModelResultGraphs: React.FC<ModelResultGraphsProps> = ({ modelData }) => {
  const iouGraph = createIoUPerModelGraph(modelData);
  const mapGraph = createMapPerModelGraph(modelData);
  const inferenceTimeGraph = createInferenceTimePerModelGraph(modelData);
  const inferenceTimeVsIouGraph = createInferenceTimeVsIoUGraph(modelData);
  const graphsArray = [
    iouGraph,
    mapGraph,
    inferenceTimeGraph,
    inferenceTimeVsIouGraph,
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-6 p-4">
      {graphsArray.map((g, idx) => (
        <div
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md"
          key={idx}
        >
          <GraphComponent data={g.data} layout={g.layout} />
        </div>
      ))}
    </div>
  );
};

export default ModelResultGraphs;
