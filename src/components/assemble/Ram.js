/**
 * @Author: Ali
 * @Date:   2020-06-02T13:46:02+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-17T15:17:10+02:00
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
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a Memory"
            className="form-control"
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
          <button className="btn btn-success"> Update My Build</button>
        </form>
      </div>
    </div>
  );
};

export default Ram;
