/**
 * @Author: Ali
 * @Date:   2020-06-03T15:57:39+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-17T15:21:37+02:00
 */
import React from "react";

const Built = ({
  myBuild: { cpu, gpu, ram, mb, hdd, hdd2, ps, fan, cas, monitor, extr1, extr2 }
}) => {
  return (
    <>
      <tbody className="ttl">
        <tr>
          <th>Totals</th>
          <td>
            {+cpu.cost +
              +gpu.cost +
              +ram.cost +
              +mb.cost +
              +hdd.cost +
              +hdd2.cost +
              +ps.cost +
              +fan.cost +
              +cas.cost +
              +monitor.cost +
              +extr1.cost +
              +extr2.cost}
          </td>
        </tr>
      </tbody>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Model</th>
            <th>Best Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CPU</td>
            <td>{cpu.brand}</td>
            <td>{cpu.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>MotherBoard</td>
            <td>{mb.brand}</td>
            <td>{mb.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Memory</td>
            <td>{ram.brand}</td>
            <td>{ram.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Graphic Card</td>
            <td>{gpu.brand}</td>
            <td>{gpu.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Primary Storage</td>
            <td>{hdd.brand}</td>
            <td>{hdd.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Secondary Storage</td>
            <td>{hdd2.brand}</td>
            <td>{hdd2.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Power Supply</td>
            <td>{ps.brand}</td>
            <td>{ps.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>CPU fan</td>
            <td>{fan.brand}</td>
            <td>{fan.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Casing</td>
            <td>{cas.brand}</td>
            <td>{cas.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Monitor</td>
            <td>{monitor.brand}</td>
            <td>{monitor.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Extra 1</td>
            <td>{extr1.brand}</td>
            <td>{extr1.cost}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Extra 2</td>
            <td>{extr2.brand}</td>
            <td>{extr2.cost}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Built;
