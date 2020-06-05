/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:20+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-05T10:28:38+02:00
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
    <div className="cpu">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a GPU"
          className="ml-3"
          value={brand}
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
