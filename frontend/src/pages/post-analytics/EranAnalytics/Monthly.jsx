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



var value = 0;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Set", "Oct", "Nov", "Dec"];
const monthDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const earn = [];

const Monthly = ({ post, mode }) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [selectMonth, setSelectMonth] = React.useState(new Date().getMonth());
  const [totalEarning, setTotalEarning] = React.useState(0);
  const [dates, setDates] = React.useState([]);
  const [currentDate, setCurrentDate] = React.useState(1);
  const [earning, setEarning] = React.useState([]);

  const handleSelect = (val) => {
    setSelectMonth(val);
    setDates([])
    setOpenMenu(false);
    setEarning([]);
    setTotalEarning(0)
  }

  React.useEffect(() => {
    value = 0;
    for (let i = 1; i <= monthDates[selectMonth]; i++) {
      setDates(prev => [...prev, i]);
    }
  }, [selectMonth, mode]);

  React.useEffect(() => {
    // console.log(dates);
    let arr = [];
    var monthTotal = 0;
    for (let i = 0; i < dates.length; i++) {
      var total = 0;
      for (let property in post.earn) {
      //  console.log(post.earn[property])
      if(new Date(Number(property)).getMonth() === selectMonth) {
        if (new Date(Number(property)).getDate() === dates[i]) {
          total += Number(post.earn[property]);
        }
      }
     }
      // console.log(`Date ${dates[i]}: ${total}`);
      // setEarning(prev => [...prev, total]);
      console.log(total)
      arr.push(total);
      monthTotal += total
    }
    // console.log("Earnin: ", arr);
    setTotalEarning(monthTotal);
    setEarning(arr)
  }, [dates]);


  const data = {
    labels: dates,
    datasets: [
      {
        label: `Total earning in ${months[selectMonth]}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#686de0",
        borderColor: "#686de0",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#130f40",
        pointBackgroundColor: "#130f40",
        pointBorderWidth: 1,
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
      <div className='month_dropdown_btn' onClick={() => setOpenMenu(p => !p)}>Select from menu</div>
      {
        openMenu &&
        <div className='month_list_section'>
        {
          months.map((val, index) => <div key={index} className="month_name" onClick={() => handleSelect(index)}>{val}</div>)
        }
      </div>
      }

      <div className='chart_container'>
        <Line data={data} />
      </div>

      <div className='data_list_container'>
        <span className='date_title'>Total earning in
          <span className='date_count'>{" "}{months[selectMonth]}:</span>
        </span>
        <span className='earn_number'>{" "}{totalEarning}</span>
      </div>

      <div className='chart_container'>
        <Bar data={data} />
      </div>
    </div>
  )
};

export default Monthly