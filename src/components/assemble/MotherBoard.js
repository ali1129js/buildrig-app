/**
 * @Author: Ali
 * @Date:   2020-06-02T13:45:42+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T16:14:45+02:00
 */
import React, { useState } from "react";

const MotherBoard = ({ updateBuild }) => {
  const [mb, setMb] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    updateBuild(mb);
    setMb("");
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
        <button> Update My myBuild</button>
      </form>
    </div>
  );
};

export default MotherBoard;
