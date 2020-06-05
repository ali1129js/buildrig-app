/**
 * @Author: Ali
 * @Date:   2020-06-02T13:46:02+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-05T10:28:49+02:00
 */
import React, { useState } from "react";

const Ram = ({ updateBuild }) => {
  const [brand, setRam] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setRam("");
    setCost("");
  };
  return (
    <div className="cpu">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a RAM"
          className="ml-3"
          value={brand}
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
