/**
 * @Author: Ali
 * @Date:   2020-06-02T13:46:02+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-22T13:00:07+02:00
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
    <div className="input-group input-group-sm mb-3">
      <form onSubmit={handleSubmit}>
        <div className="input">
          <input
            type="text"
            placeholder="Enter a Memory"
            className="form-control mr-3"
            value={brand}
            onChange={e => setRam(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cost"
            className="form-control"
            value={cost}
            onChange={e => setCost(e.target.value)}
          />
        </div>
        <button className="btn btn-success mt-3"> Update My Build</button>
      </form>
      <div className="name"> {brand} </div>
    </div>
  );
};

export default Ram;
