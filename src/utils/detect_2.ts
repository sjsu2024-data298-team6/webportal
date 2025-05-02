import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBoxes";

export interface ModelInterface {
  net: tf.GraphModel | undefined;
  inputShape: number[] | undefined;
  lables: string[] | undefined;
}

const preprocess = (
  source: HTMLVideoElement | HTMLImageElement,
  modelWidth: number,
  modelHeight: number,
): [
  tf.Tensor,
  {
    scale: number;
    dx: number;
    dy: number;
    origWidth: number;
    origHeight: number;
  },
] => {
  const imgTensor = tf.browser.fromPixels(source);
  const [origHeight, origWidth] = imgTensor.shape.slice(0, 2);

  // Compute the scaling factor (preserve aspect ratio)
  const scale = Math.min(modelWidth / origWidth, modelHeight / origHeight);
  const newWidth = Math.round(origWidth * scale);
  const newHeight = Math.round(origHeight * scale);

  // Resize image with the uniform scale.
  const resized = tf.image
    .resizeBilinear(imgTensor, [newHeight, newWidth])
    .div(255.0);

  // Compute padding (center the resized image in the model input)
  const dx = Math.floor((modelWidth - newWidth) / 2);
  const dy = Math.floor((modelHeight - newHeight) / 2);

  // Pad the resized image so that it becomes modelWidth x modelHeight
  const padded = tf.tidy(() => {
    return tf.pad(resized, [
      [dy, modelHeight - newHeight - dy],
      [dx, modelWidth - newWidth - dx],
      [0, 0],
    ]);
  });

  // Expand dims to add the batch dimension
  const input = padded.expandDims(0);

  // Dispose intermediate tensors if needed.
  tf.dispose([imgTensor, resized, padded]);

  return [input, { scale, dx, dy, origWidth, origHeight }];
};

export const detect = async (
  source: HTMLImageElement | HTMLVideoElement,
  model: ModelInterface,
  canvasRef: HTMLCanvasElement,
  callback: VoidFunction = () => {},
) => {
  if (
    model.net === undefined ||
    model.inputShape === undefined ||
    model.lables === undefined
  ) {
    throw new Error("Model is not defined properly!");
  }

  const numClass = model.lables.length;

  const inputShape = model.inputShape; // Model's first input shape
  const [modelWidth, modelHeight] = inputShape.slice(1, 3); // get model width and height

  tf.engine().startScope(); // start scoping tf engine
  const [input, { scale, dx, dy, origWidth, origHeight }] = preprocess(
    source,
    modelWidth,
    modelHeight,
  ); // preprocess image

  const res = model.net.execute(input) as tf.Tensor;

  const transRes = res.transpose([0, 2, 1]); // transpose result [b, det, n] => [b, n, det]
  const boxes = tf.tidy(() => {
    const w = transRes.slice([0, 0, 2], [-1, -1, 1]); // get width
    const h = transRes.slice([0, 0, 3], [-1, -1, 1]); // get height
    const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)); // x1
    const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)); // y1
    return tf
      .concat(
        [
          y1,
          x1,
          tf.add(y1, h), //y2
          tf.add(x1, w), //x2
        ],
        2,
      )
      .squeeze();
  }); // process boxes [y1, x1, y2, x2]

  const [scores, classes] = tf.tidy(() => {
    // class scores
    const rawScores = transRes
      .slice([0, 0, 4], [-1, -1, numClass] as [number, number, number])
      .squeeze([0]); // #6 only squeeze axis 0 to handle only 1 class models
    return [rawScores.max(1), rawScores.argMax(1)];
  }); // get max scores and classes index

  const nms = await tf.image.nonMaxSuppressionAsync(
    boxes as tf.Tensor2D,
    scores as tf.Tensor1D,
    500,
    0.45,
    0.2,
  ); // NMS to filter boxes

  const boxes_data = boxes.gather(nms, 0).dataSync(); // indexing boxes by nms index
  const scores_data = scores.gather(nms, 0).dataSync(); // indexing scores by nms index
  const classes_data = classes.gather(nms, 0).dataSync(); // indexing classes by nms index
  const adjustedBoxes: number[] = [];

  for (let i = 0; i < scores_data.length; i++) {
    let [y1, x1, y2, x2] = boxes_data.slice(i * 4, (i + 1) * 4);
    // Remove the letterbox padding and revert the scaling.
    x1 = Math.max(0, (x1 - dx) / scale);
    x2 = Math.min(origWidth, (x2 - dx) / scale);
    y1 = Math.max(0, (y1 - dy) / scale);
    y2 = Math.min(origHeight, (y2 - dy) / scale);
    adjustedBoxes.push(y1, x1, y2, x2);
  }

  // replaced boxes_data with adjustedBoxes
  renderBoxes(
    canvasRef,
    adjustedBoxes,
    scores_data,
    classes_data,
    model.lables,
    // [ origWidth, origHeight ],
  ); // render boxes
  tf.dispose([res, transRes, boxes, scores, classes, nms]); // clear memory

  callback();

  tf.engine().endScope(); // end of scoping
};

export const detectVideo = (
  vidSource: HTMLVideoElement,
  model: ModelInterface,
  canvasRef: HTMLCanvasElement,
  stopRef: { current: boolean } = { current: false },
) => {
  /**
   * Function to detect every frame from video
   */
  const detectFrame = async () => {
    if (vidSource.videoWidth === 0 && vidSource.srcObject === null) {
      const ctx = canvasRef.getContext("2d")!;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas
      return; // handle if source is closed
    }

    if (stopRef.current) {
      return; // stop detection if stop flag is set
    }

    detect(vidSource, model, canvasRef, () => {
      requestAnimationFrame(detectFrame); // get another frame
    });
  };

  detectFrame(); // initialize to detect every frame
};
