/**
 * @Author: Ali
 * @Date:   2020-06-20T10:28:31+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-20T10:29:17+02:00
 */
import React, { useState } from "react";

const Cas = ({ updateBuild }) => {
  const [brand, setCas] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setCas("");
    setCost("");
  };

  return (
    <>
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Casing"
            className="form-control"
            value={brand}
            onChange={e => setCas(e.target.value)}
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

export default Cas;
