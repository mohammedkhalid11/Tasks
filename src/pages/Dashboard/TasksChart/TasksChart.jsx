import { useState } from "react";
// التأكد من الاستيراد من react-apexcharts وليس apexcharts
import ReactApexChart from "react-apexcharts";
import styles from './TasksChart.module.css';

const TasksChart = () => {
  const [state] = useState({
    series: [
      {
        name: "New Tasks",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Completed Tasks",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Pending Tasks",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 450,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      },
      yaxis: {
        title: {
          text: "Tasks Count",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " Tasks";
          },
        },
      },
    },
  });

  return (
    <div className={styles.chartContainer}>
      <div id="chart" className={styles.chart}>
        <ReactApexChart 
          options={state.options} 
          series={state.series} 
          type="bar" 
          height={450} 
        />
      </div>
    </div>
  );
};

export default TasksChart;
