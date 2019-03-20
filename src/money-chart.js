import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {tripPoints} from "./data";

const BAR_HEIGHT = 55;
const moneyCtx = document.querySelector(`.statistic__money`);
const pointsCount = tripPoints.length;

moneyCtx.height = BAR_HEIGHT * pointsCount;

const moneyChartData = {
  labels: tripPoints.map(({type}) => `${type.icon} ${type.title.toUpperCase()}`),
  data: tripPoints.map((item) => item.money)
};

export default {
  render() {
    return new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: moneyChartData.labels,
        datasets: [{
          data: moneyChartData.data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }
};
