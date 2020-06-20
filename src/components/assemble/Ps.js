/**
 * @Author: Ali
 * @Date:   2020-06-20T10:32:57+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-20T10:39:26+02:00
 */
import React, { useState } from "react";

const Ps = ({ updateBuild }) => {
  const [brand, setPs] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setPs("");
    setCost("");
  };

  return (
    <>
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Power Supply Unit"
            className="form-control"
            value={brand}
            onChange={e => setPs(e.target.value)}
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

export default Ps;
