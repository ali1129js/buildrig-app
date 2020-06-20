/**
 * @Author: Ali
 * @Date:   2020-06-20T10:29:30+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-20T10:30:38+02:00
 */
import React, { useState } from "react";

const Extr1 = ({ updateBuild }) => {
  const [brand, setExtr1] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setExtr1("");
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
            onChange={e => setExtr1(e.target.value)}
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

export default Extr1;
