/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:42+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-22T12:59:58+02:00
 */
import React, { useState } from "react";

const MotherBoard = ({ updateBuild }) => {
  const [brand, setMb] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);
    setMb("");
    setCost("");
  };

  return (
    <div className="cpu">
      <div className="input-group input-group-sm mb-3">
        <form onSubmit={handleSubmit}>
          <div className="input">
            <input
              type="text"
              placeholder="Enter a MotherBoard"
              className="form-control mr-3"
              value={brand}
              onChange={e => setMb(e.target.value)}
            />
            <input
              type="text"
              placeholder="Cost"
              className="form-control"
              value={cost}
              onChange={e => setCost(e.target.value)}
            />{" "}
          </div>
          <button className="btn btn-success mt-3"> Update My Build</button>
        </form>
        <div className="name"> {brand} </div>
      </div>
    </div>
  );
};

export default MotherBoard;
