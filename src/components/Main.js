/**
 * @Author: Ali
 * @Date:   2020-06-02T11:16:26+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-10T11:32:17+02:00
 */
import React from "react";
import { Cpu, Gpu, MotherBoard, Ram, Hdd } from "./assemble/index.js";

const Main = ({ view, updateBuild }) => {
  switch (view) {
    case "cpu":
      return (
        <div className="form">
          <Cpu updateBuild={updateBuild} />{" "}
        </div>
      );
    case "gpu":
      return <Gpu updateBuild={updateBuild} />;
    case "mother":
      return <MotherBoard updateBuild={updateBuild} />;
    case "ram":
      return <Ram updateBuild={updateBuild} />;
    case "hdd":
      return <Hdd updateBuild={updateBuild} />;
    default:
      return null;
  }
};

export default Main;
