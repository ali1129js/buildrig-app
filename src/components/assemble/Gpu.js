/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:20+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T16:35:07+02:00
 */
import React, { useState } from "react";

const Gpu = ({ updateBuild }) => {
  const [gpu, setGpu] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    updateBuild(gpu);
    setGpu("");
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
        <button> Update My myBuild</button>
      </form>
    </div>
  );
};

export default Gpu;
