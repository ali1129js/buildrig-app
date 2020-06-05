/**
 * @Author: Ali
 * @Date:   2020-06-02T13:44:58+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-05T10:05:30+02:00
 */
import React, { useState } from "react";

const Cpu = ({ updateBuild }) => {
  const [brand, setCpu] = useState("");
  const [cost, setCost] = useState(null);
  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setCpu("");
    setCost(null);
  };
  return (
    <div className="cpu">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Enter a CPU"
          className="input"
          value={brand}
          onChange={e => setCpu(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cost"
          className="input"
          value={cost}
          onChange={e => setCost(e.target.value)}
        />
        <button> Update My myBuild</button>
      </form>
    </div>
  );
};

export default Cpu;
