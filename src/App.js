// eslint-disable-next-line
import logo from './logo.svg';
import './App.css';
// eslint-disable-next-line
import * as tf from "@tensorflow/tfjs";
// eslint-disable-next-line
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        "Hello World2!"
        <Webcam
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
      </header>
    </div>
  );
}

export default App;
