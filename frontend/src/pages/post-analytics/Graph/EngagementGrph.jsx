/** @format */

import React from "react";
import { Line } from "react-chartjs-2";

const EngagementGraph = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      // {
      //   label: "First dataset",
      //   data: [33, 53, 85, 41, 44, 65],
      //   fill: true,
      //   backgroundColor: "rgba(75,192,192,0.2)",
      //   borderColor: "#1e90ff",
      // },
      {
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: "royalblue",
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default EngagementGraph;
