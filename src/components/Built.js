/**
 * @Author: Ali
 * @Date:   2020-06-03T15:57:39+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-04T12:49:58+02:00
 */
import React from "react";

const Built = ({ assemble: { cost } }) => {
  return (
    <div className="built">
      {cost.cpu},{cost.gpu},{cost.ram},{cost.mb},"Total: "
    </div>
  );
};

export default Built;
