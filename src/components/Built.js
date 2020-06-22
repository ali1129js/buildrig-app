/**
 * @Author: Ali
 * @Date:   2020-06-03T15:57:39+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-22T12:01:48+02:00
 */
import React from "react";
import Table from "./Table";
const Built = ({ saveBuild, savedBuilds, myBuild }) => {
  return (
    <>
      <tbody className="ttl">
        <tr>
          <th>Totals € &nbsp;</th>
          <td>
            {+myBuild.cpu.cost +
              +myBuild.gpu.cost +
              +myBuild.ram.cost +
              +myBuild.mb.cost +
              +myBuild.hdd.cost +
              +myBuild.hdd2.cost +
              +myBuild.ps.cost +
              +myBuild.fan.cost +
              +myBuild.cas.cost +
              +myBuild.monitor.cost +
              +myBuild.extr1.cost +
              +myBuild.extr2.cost}
          </td>
        </tr>
      </tbody>
      <button className="btn btn-warning mt-3" onClick={saveBuild}>
        Save Build
      </button>
      <Table myBuild={myBuild} />
    </>
  );
};

export default Built;
