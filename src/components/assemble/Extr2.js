/**
 * @Author: Ali
 * @Date:   2020-06-20T10:30:43+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-20T10:31:06+02:00
 */
import React, { useState } from "react";

const Extr2 = ({ updateBuild }) => {
  const [brand, setExtr2] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setExtr2("");
    setCost("");
  };

  return (
    <>
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Extra 1"
            className="form-control"
            value={brand}
            onChange={e => setExtr2(e.target.value)}
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

export default Extr2;
