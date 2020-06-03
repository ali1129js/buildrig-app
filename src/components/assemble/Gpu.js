/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:20+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T19:18:31+02:00
 */
import React, { useState } from "react";

const Gpu = ({ updateBuild }) => {
  const [gpu, setGpu] = useState("");
  const [cost, setCost] = useState(0);
  const handleSubmit = e => {
    e.preventDefault();
    updateBuild(gpu, cost);
    setGpu("");
    setCost(0);
  };
  return (
    <div className="cpu">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Enter a GPU"
          className="ml-3"
          value={gpu}
          onChange={e => setGpu(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cost"
          className="ml-3"
          value={cost}
          onChange={e => setCost(e.target.value)}
        />
        <button> Update My myBuild</button>
      </form>
    </div>
  );
};

export default Gpu;
