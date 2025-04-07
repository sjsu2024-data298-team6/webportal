import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import {detect, detectVideo} from "@/utils/detect_2";
import ButtonHandler from "@/components/btns";

// Webcam video constraints
const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user"
};

// Load YOLO model
const loadModel = async () => {
  const model = await tf.loadGraphModel(`${window.location.href}/yolov8n_web_model/model.json`);
  return model;
};

export default function InferenceForm() {
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const [model, setModel] = useState<any>(null);  // State to store the model
  const webcamRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(null);


  // Load model when component mounts
  useEffect(() => {
    tf.ready().then(async () => {
      const yolov8 = await tf.loadGraphModel(
        `${window.location.href}/yolov8n_web_model/model.json`
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
    <div className="content">
      <video
      autoPlay
      muted
      ref={webcamRef}
      onPlay={() => detectVideo(webcamRef.current!, model, canvasRef.current!)}
      ></video>
    </div>

  );
}
