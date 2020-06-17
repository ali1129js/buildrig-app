/**
 * @Author: Ali
 * @Date:   2020-06-02T13:44:58+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-17T15:16:38+02:00
 */
import React, { useState } from "react";

const Cpu = ({ updateBuild }) => {
  const [brand, setCpu] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setCpu("");
    setCost("");
  };

  return (
    <>
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a CPU"
            className="form-control"
            value={brand}
            onChange={e => setCpu(e.target.value)}
          />

          <input
            type="text"
            placeholder="Cost"
            className="form-control"
            value={cost}
            onChange={e => setCost(e.target.value)}
          />
          <button className="btn btn-success"> Update My Build</button>
        </form>
      </div>
    </>
  );
};

export default Cpu;
