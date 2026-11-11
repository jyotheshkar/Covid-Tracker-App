import { buildChartData } from './chartData';

import React,{useState,useEffect} from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import './Table.css'

// line num 4 to 48 congfig details package options for chart
const options = {
    legend: {
        display: false,
      },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };


const LineGraph = ({casesType = "cases"}) => {
const [data,setData] = useState([]);

// https://disease.sh/v3/covid-19/historical/all?lastdays=30

const [error, setError] = useState('');
useEffect(() => {
  const controller = new AbortController();
  setData([]); setError('');
  fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120', { signal: controller.signal })
    .then((response) => { if (!response.ok) throw new Error('History request failed'); return response.json(); })
    .then((history) => { if (!controller.signal.aborted) setData(buildChartData(history, casesType)); })
    .catch(() => { if (!controller.signal.aborted) setError('Historical series is unavailable.'); });
  return () => controller.abort();
}, [casesType]);

  return (
    <div className='graph'>
      {error && <p role='alert'>{error}</p>}
      
       {data?.length > 0 && (
        
        <Line 
          options = {options}
        data={{
          datasets: [{
             backgroundColor: "rgba(204, 16, 52, 0.5)",
            //  height:"50px",
             borderColor: "#CC1034",
             data: data
         }],
        }}
      
        />
       )}
    
 
    </div>
  )
}

export default LineGraph












