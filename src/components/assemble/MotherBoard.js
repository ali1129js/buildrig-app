/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:42+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T16:50:30+02:00
 */
import React, { useState } from "react";

const MotherBoard = ({ updateBuild }) => {
  const [mb, setMb] = useState("");
  const [cost, setCost] = useState(0);
  const handleSubmit = e => {
    e.preventDefault();
    updateBuild(mb, cost);
    setMb("");
    setCost(0);
  };
  return (
    <div className="cpu">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Enter a MotherBoard"
          className="ml-3"
          value={mb}
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
