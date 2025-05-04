import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { detectVideo, ModelInterface } from "@/utils/detect_2";
import { Button } from "@/components/ui/button";
import YAML from "yaml";
import Hls from "hls.js";
import TextFormEntry from "@/components/TextFormEntry";

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
  const livestreamVideoRef = useRef<HTMLVideoElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopRef = useRef<boolean>(false);
  const hlsRef = useRef<Hls | null>(null);

  const [model, setModel] = useState<ModelInterface>({
    net: undefined,
    inputShape: undefined,
    lables: undefined,
  });

  const [livestreamUrl, setLivestreamUrl] = useState(
    "https://wzmedia.dot.ca.gov/D3/5_Cosumnes_River_Blvd_OC_SAC5_NB.stream/playlist.m3u8",
  );
  const [inputLivestreamUrl, setInputLivestreamUrl] = useState(livestreamUrl);

  useEffect(() => {
    return () => {
      stopRef.current = true;
      setIsInferencing(false);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
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
    let video: HTMLVideoElement | null | undefined;

    if (isWebCamCaptureEnable) {
      video = webcamRef.current?.video;
    } else if (isLiveCaptureEnable) {
      video = livestreamVideoRef.current;
    }

    if (canvas && video) {
      const handleLoadedMetadata = () => {
        canvas.width = video!.videoWidth;
        canvas.height = video!.videoHeight;
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video?.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [isWebCamCaptureEnable, isLiveCaptureEnable]);

  useEffect(() => {
    const video = livestreamVideoRef.current;

    if (!isLiveCaptureEnable || !video) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(livestreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = livestreamUrl;
    } else {
      console.error("HLS is not supported in this browser");
    }

    return () => {};
  }, [isLiveCaptureEnable, livestreamUrl]);

  const startInference = () => {
    stopRef.current = false;
    let videoElement: HTMLVideoElement | null = null;

    if (isWebCamCaptureEnable && webcamRef.current?.video) {
      videoElement = webcamRef.current.video;
    } else if (isLiveCaptureEnable && livestreamVideoRef.current) {
      videoElement = livestreamVideoRef.current;
    }

    if (
      videoElement &&
      model.net &&
      model.inputShape &&
      model.lables &&
      canvasRef.current
    ) {
      detectVideo(videoElement, model, canvasRef.current, stopRef);
      setIsInferencing(true);
    } else {
      console.error(
        "Cannot start inference: Video element, model, or canvas is not ready.",
      );
    }
  };

  const stopInference = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    setIsInferencing(false);
    stopRef.current = true;
  };

  const handleLivestreamUrlSubmit = () => {
    setLivestreamUrl(inputLivestreamUrl);
    if (isLiveCaptureEnable && livestreamVideoRef.current) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setLiveCaptureEnable(false);
      setTimeout(() => {
        setLiveCaptureEnable(true);
      }, 0);
    }
  };

  return (
    <div className="w-full">
      {isLoadingModel ? (
        <Button variant={"secondary"} disabled>
          Loading...
        </Button>
      ) : (
        <div className="flex flex-row gap-4">
          {!isWebCamCaptureEnable && !isLiveCaptureEnable && (
            <>
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
            </>
          )}
        </div>
      )}
      {isLiveCaptureEnable && (
        <>
          <div>
            <Button
              variant={"destructive"}
              onClick={() => {
                setLiveCaptureEnable(false);
                setIsInferencing(false);
                stopRef.current = true;
                if (livestreamVideoRef.current) {
                  livestreamVideoRef.current.pause();
                }
              }}
            >
              Close Livestream
            </Button>
          </div>
          <div>
            <div className="flew-row my-4 flex items-end gap-2">
              <TextFormEntry
                heading="Livestream URL"
                formkey="livestreamUrl"
                value={inputLivestreamUrl}
                onChange={(value) => setInputLivestreamUrl(value)}
              />
              <Button onClick={handleLivestreamUrlSubmit}>Submit</Button>
            </div>
            <div className="relative my-4 aspect-video w-full">
              <video
                ref={livestreamVideoRef}
                controls={true}
                autoPlay
                playsInline
                muted
                className="absolute left-0 top-0 h-full w-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute left-0 top-0 z-50 h-full w-full"
              />
            </div>
            {!isInferencing ? (
              <Button onClick={startInference} variant={"default"}>
                Start Inference
              </Button>
            ) : (
              <Button onClick={stopInference} variant={"destructive"}>
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
                className="absolute left-0 top-0 h-full w-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute left-0 top-0 z-50 h-full w-full"
              />
            </div>
            {!isInferencing ? (
              <Button onClick={startInference} variant={"default"}>
                Start Inference
              </Button>
            ) : (
              <Button onClick={stopInference} variant={"destructive"}>
                Stop Inference
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
