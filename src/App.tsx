import "./styles.css";
import {
  UsePanExample,
  // UseScaleExample,
  // UsePanScaleExample,
  // BufferExample,
  TrackingExample
} from "./examples";
import React from "react";

const App = () => {
  return <UsePanExample />;

  // switch (window.location.hash) {
  //   case "#use-pan":
  //     return <UsePanExample />;
  //   case "#use-scale":
  //     return <UseScaleExample />;
  //   case "#use-pan-scale":
  //     return <UsePanScaleExample />;
  //   case "#buffer":
  //     return <BufferExample />;
  //   case "#tracking":
  return <TrackingExample hideData={false} />;
  //   default:
  //     return <p>Choose an example.</p>;
  // }
};

export default App;
