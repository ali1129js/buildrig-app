/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:42+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-05T10:05:49+02:00
 */
import React, { useState } from "react";

const MotherBoard = ({ updateBuild }) => {
  const [brand, setMb] = useState("");
  const [cost, setCost] = useState(null);
  const handleSubmit = e => {
    e.preventDefault();
    let item = { brand, cost };
    updateBuild(item);

    setMb("");
    setCost(null);
  };
  return (
    <div className="cpu">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Enter a MotherBoard"
          className="ml-3"
          value={brand}
          onChange={e => setMb(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cost"
          className="ml-3"
          value={cost}
          onChange={e => setCost(e.target.value)}
        />
        <button> Update My myBuild</button>
      </form>
    </div>
  );
};

export default MotherBoard;
