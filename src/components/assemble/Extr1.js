/**
 * @Author: Ali
 * @Date:   2020-06-20T10:29:30+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-22T12:59:26+02:00
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
      <div className="input-group input-group-sm mb-3">
        <form onSubmit={handleSubmit}>
          <div className="input">
            {" "}
            <input
              type="text"
              placeholder="Accessory 1"
              className="form-control mr-3"
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
            />{" "}
          </div>
          <button className="btn btn-success mt-3"> Update My Build</button>
        </form>
        <div className="name"> {brand} </div>
      </div>
    </>
  );
};

export default Extr1;
