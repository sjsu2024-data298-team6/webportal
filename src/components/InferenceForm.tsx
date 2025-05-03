import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { detectVideo, ModelInterface } from "@/utils/detect_2";
import { Button } from "@/components/ui/button";
import YAML from "yaml";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

interface InferenceFormProps {
  modelID: number;
}

export default function InferenceForm({ modelID }: InferenceFormProps) {
  const [isWebCamCaptureEnable, setWebCamCaptureEnable] = useState(false);
  const [isLiveCaptureEnable, setLiveCaptureEnable] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isInferencing, setIsInferencing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopRef = useRef<boolean>(false);
  const [model, setModel] = useState<ModelInterface>({
    net: undefined,
    inputShape: undefined,
    lables: undefined,
  }); // State to store the model

  useEffect(() => {
    return () => {
      stopRef.current = true;
      setIsInferencing(false);
    };
  }, []);

  useEffect(() => {
    tf.ready().then(async () => {
      const tfjsResponse = await fetch(`/api/inference/${modelID}`);
      const tfjsData = (await tfjsResponse.json()) as { tfjsS3Key: string };

      const modelMetadataYamlResponse = await fetch(
        `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${tfjsData.tfjsS3Key}/metadata.yaml`,
      );
      const modelMetadataYamlText = await modelMetadataYamlResponse.text();

      const modelMetadataYaml = YAML.parse(modelMetadataYamlText);

      const labels = Object.values(modelMetadataYaml.names);

      const modelWeights = await tf.loadGraphModel(
        `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${tfjsData.tfjsS3Key}/model.json`,
      ); // load model
      setIsLoadingModel(false);

      // warming up model
      const dummyInput = tf.ones(modelWeights.inputs[0].shape!);
      const warmupResults = modelWeights.execute(dummyInput);

      setModel({
        net: modelWeights,
        inputShape: modelWeights.inputs[0].shape,
        lables: labels as string[],
      }); // set model & input shape

      tf.dispose([warmupResults, dummyInput]); // cleanup memory
    });
  }, [modelID]);

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
      {isWebCamCaptureEnable ||
        isLiveCaptureEnable ||
        (isLoadingModel ? (
          <Button variant={"secondary"} disabled>
            Loading...
          </Button>
        ) : (
          <div className="flex flex-row gap-4">
            <Button
              variant={"default"}
              onClick={() => setWebCamCaptureEnable(true)}
            >
              Open Webcam
            </Button>
            <Button
              variant={"default"}
              onClick={() => setLiveCaptureEnable(true)}
            >
              Open Livestream
            </Button>
          </div>
        ))}
      {isLiveCaptureEnable && (
        <>
          <div>
            <Button
              variant={"destructive"}
              onClick={() => {
                setLiveCaptureEnable(false);
                setIsInferencing(false);
                stopRef.current = true;
              }}
            >
              Close Livestream
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
      {isWebCamCaptureEnable && (
        <>
          <div>
            <Button
              variant={"destructive"}
              onClick={() => {
                setWebCamCaptureEnable(false);
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
