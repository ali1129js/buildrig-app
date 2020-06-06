/**
 * @Author: Ali
 * @Date:   2020-06-06T13:45:02+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-06T13:57:49+02:00
 */
import React, { useState } from "react";

const Hdd = ({ updateBuild }) => {
  const [brand, setHdd] = useState("");
  const [cost, setCost] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setHdd("");
    setCost("");
  };
  return (
    <div className="cpu">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a Hard Disk"
          className="ml-3"
          value={brand}
          onChange={e => setHdd(e.target.value)}
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

export default Hdd;
