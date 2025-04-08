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
  const [isInferencing, setIsInferencing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopRef = useRef<boolean>(false);
  const [model, setModel] = useState<ModelInterface>({
    net: undefined,
    inputShape: undefined,
  }); // State to store the model

  useEffect(() => {
    return () => {
      stopRef.current = true;
      setIsInferencing(false);
    };
  }, []);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }, []);

  return (
    <div className="w-full">
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
              className="mb-8 rounded-xl border border-black bg-red-500 px-4 py-1 hover:bg-red-600"
              onClick={() => {
                setCaptureEnable(false);
                setIsInferencing(false);
                stopRef.current = true;
              }}
            >
              Close Webcam
            </button>
          </div>
          <div>
            <div className="relative aspect-video w-full">
              <Webcam
                audio={false}
                width={720}
                height={512}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onLoadedMetadata={() => {
                  const video = webcamRef.current?.video;
                  const canvas = canvasRef.current;
                  if (video && canvas) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                  }
                }}
                className="absolute left-0 top-0 h-full w-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute left-0 top-0 z-50 h-full w-full"
              />
            </div>
            {!isInferencing ? (
              <button
                onClick={() => {
                  stopRef.current = false;
                  detectVideo(
                    webcamRef.current!.video!,
                    model,
                    canvasRef.current!,
                    stopRef,
                  );
                  setIsInferencing(true);
                }}
                className="mt-8 rounded-xl border border-black bg-blue-400 px-4 py-1 hover:bg-blue-500"
              >
                Start Inference
              </button>
            ) : (
              <button
                onClick={() => {
                  let ctx = canvasRef.current!.getContext("2d")!;
                  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                  ctx = canvasRef.current!.getContext("2d")!;
                  setIsInferencing(false);
                  stopRef.current = true;
                }}
                className="mt-8 rounded-xl border border-black bg-red-500 px-4 py-1 hover:bg-red-600"
              >
                Stop Inference
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
