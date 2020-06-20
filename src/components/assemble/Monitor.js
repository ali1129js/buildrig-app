/**
 * @Author: Ali
 * @Date:   2020-06-20T10:32:16+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-20T10:32:51+02:00
 */
import React, { useState } from "react";

const Monitor = ({ updateBuild }) => {
  const [brand, setMonitor] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setMonitor("");
    setCost("");
  };

  return (
    <>
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Monitor"
            className="form-control"
            value={brand}
            onChange={e => setMonitor(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Cost"
            className="form-control"
            value={cost}
            onChange={e => setCost(e.target.value)}
            required
          />
          <button className="btn btn-success"> Update My Build</button>
        </form>
      </div>
    </>
  );
};

export default Monitor;
