import React from 'react';
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, PointElement,
  Chart, ChartConfiguration, LineController, LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement, LineController, LineElement
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Set", "Oct", "Nov", "Dec"]

const Daily = ({ post }) => {
  const [earning, setEarning] = React.useState([]);
  const [time, setTime] = React.useState([]);
  const [mode, setMode] = React.useState("daily");
  const [total, setTotal] = React.useState(0)

  React.useEffect(() => {
    for (const property in post.earn) {
        if (new Date().getDate() - new Date(Number(property)).getDate() === 0) {
          setEarning(prev => [...prev, post.earn[property]]);
          setTotal(prev => prev + Number(post.earn[property]))
          setTime(prev => [...prev, `${new Date(Number(property)).getHours()}:${new Date(Number(property)).getMinutes()}`]);
        }
      }
  }, []);


  const data = {
    labels: time,
    datasets: [
      {
        label: "Post minute earning",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "#686de0",
        borderColor: "#686de0",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#130f40",
        pointBackgroundColor: "#130f40",
        pointBorderWidth: 5,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: earning
      }
    ]
  };

  return (
    <div>
      <Line data={data} />

      <div className='data_list_container'>
        <span className='date_title'>Date:{" "}
          <span className='date_count'>{new Date().getDate()}/{months[new Date().getMonth()]}/{new Date().getFullYear()}</span>
        </span><br />


        <span className='earn_title'>Total earning:{" "}<span className='earn_number'>{total}</span></span>
      </div>
    </div>
  )
}

export default Daily