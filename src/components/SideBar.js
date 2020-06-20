/**
 * @Author: Ali
 * @Date:   2020-06-02T11:15:37+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-20T10:06:27+02:00
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
        Disk II
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"cas"}
      >
        Casing
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"ps"}
      >
        Power Supply
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"fan"}
      >
        Cooling
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"monitor"}
      >
        Monitor
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"extr1"}
      >
        Extra 1
      </button>
      <button
        className="btn btn-secondary btn-lg m-1"
        onClick={handleClick}
        value={"extr2"}
      >
        Extra 2
      </button>
    </div>
  </section>
);

export default SideBar;
