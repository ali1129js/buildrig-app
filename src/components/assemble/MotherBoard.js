/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:42+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-17T15:17:02+02:00
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
      <div className="input-group mb-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a MotherBoard"
            className="form-control"
            value={brand}
            onChange={e => setMb(e.target.value)}
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

export default MotherBoard;
