/** @format */

import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  LineElement,
  ArcElement
);

ChartJS.register(ArcElement, Tooltip, Legend);

const OverallAnalytics = () => {
  return <div>Overall analytics</div>;
};
export default OverallAnalytics;
