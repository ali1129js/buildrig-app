/**
 * @Author: Ali
 * @Date:   2020-06-17T15:51:40+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-22T12:54:18+02:00
 */
import React, { useState } from "react";

const Hdd2 = ({ updateBuild }) => {
  const [brand, setHdd2] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setHdd2("");
    setCost("");
  };

  return (
    <>
      <div className="input-group input-group-sm mb-3">
        <form onSubmit={handleSubmit}>
          <div className="input">
            <input
              type="text"
              placeholder="Secondary Storage"
              className="form-control mr-3"
              value={brand}
              onChange={e => setHdd2(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Cost"
              className="form-control"
              value={cost}
              onChange={e => setCost(e.target.value)}
              required
            />{" "}
          </div>
          <button className="btn btn-success mt-3"> Update My Build</button>
        </form>
      </div>
    </>
  );
};

export default Hdd2;
