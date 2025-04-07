import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { detectVideo } from "@/utils/detect_2";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

export default function InferenceForm() {
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState<any>(null); // State to store the model
  useEffect(() => {
    tf.ready().then(async () => {
      const yolov8 = await tf.loadGraphModel(
        `${window.location.href}/yolov8n_web_model/model.json`,
      ); // load model

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
      <header>
        <h1>Webcam</h1>
      </header>
      {isCaptureEnable || (
        <button onClick={() => setCaptureEnable(true)}>Open Webcam</button>
      )}
      {isCaptureEnable && (
        <>
          <div>
            <button onClick={() => setCaptureEnable(false)}>
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
                  canvasRef.current!,
                )
              }
            >
              tst
            </button>
          </div>
        </>
      )}
    </>
  );
}
