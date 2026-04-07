import { useState } from "react"
import ReactApexChart from "react-apexcharts"
import styles from './UsersCountChart.module.css'
const UsersCountChart = () => {
        const [state, setState] =useState({
          
            series: [{
                name: "Users Count",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }],
            options: {
              chart: {
                height: 450,
                type: 'line',
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'straight'
              },
              title: {
                text: 'Users Count Over Time',
                align: 'left'
              },
              grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              }
            },
          
          
        });

        

        return (
          <div className={styles.chartContainer}>
            <div id="chart" className={styles.chart}>
                <ReactApexChart options={state.options} series={state.series} type="line" height={450} />
              </div>
            
          </div>
        );
      }

      export default UsersCountChart