/**
 * @Author: Ali
 * @Date:   2020-06-06T13:45:02+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-17T15:26:22+02:00
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
    <>
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Primary Storage"
            className="form-control"
            value={brand}
            onChange={e => setHdd(e.target.value)}
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

export default Hdd;
