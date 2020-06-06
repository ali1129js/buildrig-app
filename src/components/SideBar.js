/**
 * @Author: Ali
 * @Date:   2020-06-02T11:15:37+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-06T13:50:13+02:00
 */
import React from "react";

const SideBar = ({ handleClick }) => (
  <section className="sidebar">
    <button
      className="btn btn-secondary btn-lg"
      onClick={handleClick}
      value={"cpu"}
    >
      CPU
    </button>
    <button
      className="btn btn-secondary btn-lg"
      onClick={handleClick}
      value={"mother"}
    >
      MotherBoard
    </button>
    <button
      className="btn btn-secondary btn-lg"
      onClick={handleClick}
      value={"ram"}
    >
      RAM
    </button>
    <button
      className="btn btn-secondary btn-lg"
      onClick={handleClick}
      value={"gpu"}
    >
      GPU
    </button>
    <button
      className="btn btn-secondary btn-lg"
      onClick={handleClick}
      value={"hdd"}
    >
      Hard Disk
    </button>
    <button
      className="btn btn-secondary btn-lg"
      onClick={handleClick}
      value={"case"}
    >
      Case
    </button>
  </section>
);

export default SideBar;
