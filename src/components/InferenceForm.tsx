import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { detectVideo, ModelInterface } from "@/utils/detect_2";
import { Button } from "@/components/ui/button";

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
      const yolov8 = await tf.loadGraphModel("/yolov8n_web_model/model.json"); // load model
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
      {isCaptureEnable ||
        (isLoadingModel ? (
          <Button variant={"secondary"}>Loading...</Button>
        ) : (
          <Button variant={"default"} onClick={() => setCaptureEnable(true)}>
            Open Webcam
          </Button>
        ))}
      {isCaptureEnable && (
        <>
          <div>
            <Button
              variant={"destructive"}
              onClick={() => {
                setCaptureEnable(false);
                setIsInferencing(false);
                stopRef.current = true;
              }}
            >
              Close Webcam
            </Button>
          </div>
          <div>
            <div className="relative my-4 aspect-video w-full">
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
              <Button
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
                variant={"default"}
              >
                Start Inference
              </Button>
            ) : (
              <Button
                onClick={() => {
                  let ctx = canvasRef.current!.getContext("2d")!;
                  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                  ctx = canvasRef.current!.getContext("2d")!;
                  setIsInferencing(false);
                  stopRef.current = true;
                }}
                variant={"destructive"}
              >
                Stop Inference
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
