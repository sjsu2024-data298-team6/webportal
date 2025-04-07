import { useState, useRef, FC } from "react";
import { Webcam } from "@/utils/webcam_tst";

interface ButtonHandlerProps {
  imageRef: React.RefObject<HTMLImageElement>;
  cameraRef: React.RefObject<HTMLVideoElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const ButtonHandler: FC<ButtonHandlerProps> = ({ imageRef, cameraRef, videoRef }) => {
  const [streaming, setStreaming] = useState<string | null>(null);
  const inputImageRef = useRef<HTMLInputElement | null>(null);
  const inputVideoRef = useRef<HTMLInputElement | null>(null);
  const webcam = new Webcam();

  const closeImage = (): void => {
    const url: string | undefined = imageRef.current?.src;
    if (imageRef.current) {
      imageRef.current.src = "#";
      URL.revokeObjectURL(url!);
      setStreaming(null);
      if (inputImageRef.current) inputImageRef.current.value = "";
      imageRef.current.style.display = "none";
    }
  };

  const closeVideo = (): void => {
    const url: string | undefined = videoRef.current?.src;
    if (videoRef.current) {
      videoRef.current.src = "";
      URL.revokeObjectURL(url!);
      setStreaming(null);
      if (inputVideoRef.current) inputVideoRef.current.value = "";
      videoRef.current.style.display = "none";
    }
  };

  return (
    <div className="btn-container">
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const url: string = URL.createObjectURL(e.target.files![0]);
          if (imageRef.current) {
            imageRef.current.src = url;
            imageRef.current.style.display = "block";
            setStreaming("image");
          }
        }}
        ref={inputImageRef}
      />
      <button
        onClick={() => {
          if (streaming === null) inputImageRef.current?.click();
          else if (streaming === "image") closeImage();
          else alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`);
        }}
      >
        {streaming === "image" ? "Close" : "Open"} Image
      </button>

      <input
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (streaming === "image") closeImage();
          const url: string = URL.createObjectURL(e.target.files![0]);
          if (videoRef.current) {
            videoRef.current.src = url;
            videoRef.current.addEventListener("ended", () => closeVideo());
            videoRef.current.style.display = "block";
            setStreaming("video");
          }
        }}
        ref={inputVideoRef}
      />
      <button
        onClick={() => {
          if (streaming === null || streaming === "image") inputVideoRef.current?.click();
          else if (streaming === "video") closeVideo();
          else alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`);
        }}
      >
        {streaming === "video" ? "Close" : "Open"} Video
      </button>

      <button
        onClick={() => {
          if (streaming === null || streaming === "image") {
            if (streaming === "image") closeImage();
            webcam.open(cameraRef.current!);
            cameraRef.current!.style.display = "block";
            setStreaming("camera");
          } else if (streaming === "camera") {
            webcam.close(cameraRef.current!);
            cameraRef.current!.style.display= 'none';
           setStreaming(null); 
         }else{
           alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`); 
         }
       }}
     >
       {streaming === 'camera' ? 'Close' : 'Open'} Webcam 
     </button>
   </div>
 );
};

export default ButtonHandler;