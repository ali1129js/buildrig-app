/**
 * @Author: Ali
 * @Date:   2020-06-02T11:15:37+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-17T15:54:28+02:00
 */
import React from "react";

const SideBar = ({ handleClick }) => (
  <section className="sidebar">
    <div className="btn-group-vertical">
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"cpu"}
      >
        CPU
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"mother"}
      >
        MotherBoard
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"ram"}
      >
        RAM
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"gpu"}
      >
        GPU
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"hdd"}
      >
        Main Disk
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"hdd2"}
      >
        Secondary Disk
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"case"}
      >
        Case
      </button>
    </div>
  </section>
);

export default SideBar;
