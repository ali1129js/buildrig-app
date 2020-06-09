/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:20+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-09T14:58:34+02:00
 */
import React, { useState } from "react";

const Gpu = ({ updateBuild }) => {
  const [brand, setGpu] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setGpu("");
    setCost("");
  };

  return (
    <div className="gpu">
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a GPU"
            className="form-control"
            value={brand}
            onChange={e => setGpu(e.target.value)}
          />
          <button className="btn btn-info mb-2">Search</button>
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
    </div>
  );
};

export default Gpu;
