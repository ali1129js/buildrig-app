/**
 * @Author: Ali
 * @Date:   2020-06-02T13:44:58+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-04T11:26:22+02:00
 */
import React, { useState } from "react";

const Cpu = ({ updateBuild }) => {
  const [cpu, setCpu] = useState("");
  const [cost, setCost] = useState(0);
  const handleSubmit = e => {
    e.preventDefault();
    updateBuild(cpu, cost);
    setCpu("");
    setCost(0);
  };
  return (
    <div className="cpu">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Enter a CPU"
          className="input"
          value={cpu}
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
