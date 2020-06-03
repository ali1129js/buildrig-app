/**
 * @Author: Ali
 * @Date:   2020-06-02T13:44:58+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T15:55:50+02:00
 */
import React, { useState } from "react";

const Cpu = ({ updateBuild }) => {
  const [cpu, setCpu] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    updateBuild(cpu);
    setCpu("");
  };
  return (
    <div className="cpu">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Enter a CPU"
          className="ml-3"
          value={cpu}
          onChange={e => setCpu(e.target.value)}
        />
        <button> Update My myBuild</button>
      </form>
    </div>
  );
};

export default Cpu;
