/**
 * @Author: Ali
 * @Date:   2020-06-02T13:46:02+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T17:19:14+02:00
 */
import React, { useState } from "react";

const Ram = ({ updateBuild }) => {
  const [ram, setRam] = useState("");
  const [cost, setCost] = useState(0);

  const handleSubmit = e => {
    e.preventDefault();
    updateBuild(ram, cost);
    setRam("");
    setCost(0);
  };
  return (
    <div className="cpu">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Enter a RAM"
          className="ml-3"
          value={ram}
          onChange={e => setRam(e.target.value)}
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

export default Ram;
