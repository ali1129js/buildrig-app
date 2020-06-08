/**
 * @Author: Ali
 * @Date:   2020-06-03T15:57:39+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-08T13:27:41+02:00
 */
import React from "react";

const Built = ({ myBuild: { cpu, gpu, mb, ram, hdd } }) => {
  let total =
    parseInt(cpu.cost) +
    parseInt(gpu.cost) +
    parseInt(ram.cost) +
    parseInt(hdd.cost) +
    parseInt(mb.cost);

  return (
    <div className="built">
      <table>
        <tr>
          <th>Component</th>
          <th>Model</th>
          <th>Best Price</th>
        </tr>
        <tr>
          <td>CPU</td>
          <td>{cpu.brand}</td>
          <td>{cpu.cost}</td>
        </tr>
        <tr>
          <td>MotherBoard</td>
          <td>{mb.brand}</td>
          <td>{mb.cost}</td>
        </tr>
        <tr>
          <td>RAM</td>
          <td>{ram.brand}</td>
          <td>{ram.cost}</td>
        </tr>
        <tr>
          <td>GPU</td>
          <td>{gpu.brand}</td>
          <td>{gpu.cost}</td>
        </tr>
        <tr>
          <td>HDD</td>
          <td>{hdd.brand}</td>
          <td>{hdd.cost}</td>
        </tr>
      </table>

      <div className="total">
        Total :<strong> {total} </strong>
      </div>
    </div>
  );
};

export default Built;
