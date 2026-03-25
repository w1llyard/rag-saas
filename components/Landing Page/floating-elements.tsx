import React from "react";
import GradientBlur from "./gradient-blur";

const FloatingElements = () => (
  <>
    <GradientBlur
      className="top-20 left-20 w-72 h-72 animate-pulse"
      color="purple"
    />
    <GradientBlur
      className="bottom-20 right-20 w-96 h-96 animate-pulse delay-1000"
      color="blue"
    />
    <GradientBlur
      className="top-1/2 left-1/2 w-64 h-64 animate-pulse delay-500"
      color="green"
    />
  </>
);

export default FloatingElements;
