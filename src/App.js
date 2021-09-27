import React, { useRef } from "react";
import './App.css';
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";

function App() {
  const [imgSrc, setImgSrc] = React.useState(null); //capture를 위해서?
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var squatCount = 0;

  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: { width: 257, height: 200 },
      quantBytes: 2
    });
    //
    setInterval(() => {
      detect(net);
    }, 2000);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      //console.log(pose.keypoints[11].position["x"]); //골반 x좌표
      const heep_x = pose.keypoints[11].position["x"];
      const heep_y = pose.keypoints[11].position["x"];

      const shol_y = pose.keypoints[6].position["y"]; //오른쪽 어깨
      const knee_y = pose.keypoints[14].position["y"]; //오른쪽 무릎
      var diff = knee_y - shol_y;
      //console.log("어깨" + shol);
      //console.log("무릎" + knee);

      const shol_x = pose.keypoints[6].position["x"];
      const knee_x = pose.keypoints[14].position["x"]; //오른쪽 무릎

      var isSholCenter = false;
      var isKneeCenter = false;
      if (shol_x > 180 && shol_x < 280) {
        isSholCenter = true;
      }
      if (knee_x > 180 && knee_x < 280) {
        isKneeCenter = true;
      }
      if (isSholCenter && isKneeCenter) {
        if (diff >= 300)
          console.log("ready   diff:" + diff)
        if (diff < 300) { //앉았을때
          console.log("스퀏!   diff:" + diff)
          squatCount++;
          document.getElementById("count").innerHTML = squatCount;

          //screen shot 찍기
          const imageSrc = webcamRef.current.getScreenshot();
          setImgSrc(imageSrc);
        }
      }






      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  runPosenet();



  return (
    <div className="App">
      <div>
        <h1>
          라이브 비디오 + PoseNet
        </h1>
      </div>
      <div>
        스쿼트 횟수:
        <span id="count"></span>
      </div>
      <div>
        <img
          src={imgSrc}
        />
      </div>
      <div>
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </div>

    </div>
  );
}

export default App;
