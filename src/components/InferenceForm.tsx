import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { detectVideo, ModelInterface } from "@/utils/detect_2";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

export default function InferenceForm() {
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<ModelInterface>({
    net: undefined,
    inputShape: undefined,
  }); // State to store the model
  useEffect(() => {
    tf.ready().then(async () => {
      const yolov8 = await tf.loadGraphModel(
        `${window.location.href}/yolov8n_web_model/model.json`,
      ); // load model
      setIsLoadingModel(false);

      // warming up model
      const dummyInput = tf.ones(yolov8.inputs[0].shape!);
      const warmupResults = yolov8.execute(dummyInput);

      setModel({
        net: yolov8,
        inputShape: yolov8.inputs[0].shape,
      }); // set model & input shape

      tf.dispose([warmupResults, dummyInput]); // cleanup memory
    });
  }, []);

  return (
    <>
      {isCaptureEnable || (
        <button
          className={
            isLoadingModel
              ? "rounded-xl border border-black bg-gray-300 px-4 py-1"
              : "rounded-xl border border-black bg-blue-400 px-4 py-1 hover:bg-blue-500"
          }
          onClick={() => setCaptureEnable(true)}
        >
          {isLoadingModel ? "Loading..." : "Open Webcam"}
        </button>
      )}
      {isCaptureEnable && (
        <>
          <div>
            <button
              className="rounded-xl border border-black bg-red-500 px-4 py-1 hover:bg-red-600"
              onClick={() => setCaptureEnable(false)}
            >
              Close Webcam
            </button>
          </div>
          <div>
            <Webcam
              audio={false}
              width={720}
              height={512}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
            <button
              onClick={() =>
                detectVideo(
                  webcamRef.current!.video!,
                  model,
                  webcamRef.current!.getCanvas()!,
                )
              }
              className="mt-8 rounded-xl border border-black bg-blue-400 px-4 py-1 hover:bg-blue-500"
            >
              Start Inference
            </button>
          </div>
        </>
      )}
    </>
  );
}
