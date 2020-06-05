/**
 * @Author: Ali
 * @Date:   2020-06-02T13:44:58+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-05T10:28:55+02:00
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
    <div className="cpu">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a CPU"
          className="ml-3"
          value={brand}
          onChange={e => setCpu(e.target.value)}
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

export default Cpu;
