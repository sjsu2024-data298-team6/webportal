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

  return (
    <div className="grid w-full grid-cols-1 gap-6 p-4 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
        <span className="text-lg">IoU per Model</span>
        <div>
          <GraphComponent data={iouGraph.data} layout={iouGraph.layout} />
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
        <span className="text-lg">mAP per Model</span>
        <div>
          <GraphComponent data={mapGraph.data} layout={mapGraph.layout} />
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
        <span className="text-lg">Inference Time per Model</span>
        <div>
          <GraphComponent
            data={inferenceTimeGraph.data}
            layout={inferenceTimeGraph.layout}
          />
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
        <span className="text-lg">Inference time vs IoU per Model</span>
        <div>
          <GraphComponent
            data={inferenceTimeVsIouGraph.data}
            layout={inferenceTimeVsIouGraph.layout}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelResultGraphs;
