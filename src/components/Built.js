/**
 * @Author: Ali
 * @Date:   2020-06-03T15:57:39+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-05T10:29:58+02:00
 */
import React from "react";

const Built = ({ myBuild: { cpu, gpu, mb, ram } }) => {
  let total =
    parseInt(cpu.cost) +
    parseInt(gpu.cost) +
    parseInt(ram.cost) +
    parseInt(mb.cost);

  return (
    <div className="built">
      <div className="cpu">
        <strong> CPU: </strong>
        {cpu.brand} <strong> Cost: </strong>
        {cpu.cost}
      </div>
      <div className="gpu">
        <strong> GPU: </strong>
        {gpu.brand} <strong> Cost: </strong>
        {gpu.cost}
      </div>
      <div className="ram">
        <strong> RAM: </strong>
        {ram.brand} <strong> Cost: </strong>
        {ram.cost}
      </div>
      <div className="mb">
        <strong> MB: </strong>
        {mb.brand} <strong> Cost: </strong>
        {mb.cost}
      </div>
      <div className="total">
        Total :<strong> {total} </strong>
      </div>
    </div>
  );
};

export default Built;
