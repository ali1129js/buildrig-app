/**
 * @Author: Ali
 * @Date:   2020-06-02T13:46:02+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T16:36:00+02:00
 */
import React, { useState } from "react";

const Ram = ({ updateBuild }) => {
  const [ram, setRam] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    updateBuild(ram);
    setRam("");
  };
  return (
    <div className="cpu">
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Enter a RAM"
          className="ml-3"
          value={ram}
          onChange={e => setRam(e.target.value)}
        />
        <button> Update My myBuild</button>
      </form>
    </div>
  );
};

export default Ram;
