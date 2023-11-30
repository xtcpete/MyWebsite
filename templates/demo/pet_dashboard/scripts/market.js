// -------- Line Chart --------
let lineChart;
const lineChartData = {
  labels: [],
  datasets: [{
    label: 'Sale (Billion)',
    data: [],
    fill: false,
    borderColor: '#9C6925',
    tension: 0.1
  }]
};

const lineChartConfig = {
  type: 'line',
  data: lineChartData,
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Market Trend'
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Year'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Sale ($)'
        }
      }
    },
    onClick: function (evt) {
      const activePoints = lineChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
      if (activePoints.length) {
        const firstPointIndex = activePoints[0].index;
        const year = lineChart.data.labels[firstPointIndex];
        updatePieChartForYear(year);
      }
    }
  }
};

// Fetch and process the line chart data
fetch('../data/market_sale_data.csv')
  .then(response => response.text())
  .then(csv => {
  
    const results = Papa.parse(csv, { header: true, dynamicTyping: true });
    const data = results.data;


    lineChartConfig.data.labels = data.map(d => d.year);
    lineChartConfig.data.datasets[0].data = data.map(d => d.total);


    const ctx = document.getElementById('line-chart').getContext('2d');
    lineChart = new Chart(ctx, lineChartConfig);
  })
  .catch(error => console.error('Error loading the data: ', error));

// -------- Pie Chart --------
let pieChart;
const pieChartConfig = {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#E29F26', '#5D9B2B', '#E2267D', '#6967A7'],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Sales Distribution by Category'
      }
    }
  }
};

let csvData = {};

function processCSVData(results) {

  csvData = results.data.reduce((acc, cur) => {
    const year = cur.Year;
    const category = cur.Category;
    const value = parseFloat(cur.Value);
    
    if (!acc[year]) {
      acc[year] = {};
    }

    acc[year][category] = value;
    
    return acc;
  }, {});

  updatePieChartForYear(document.getElementById('year-select').value);
}

function updatePieChartForYear(year) {
  document.getElementById('year-select').value = year;
  const data = csvData[year];
  pieChartConfig.data.labels = Object.keys(data);
  pieChartConfig.data.datasets[0].data = Object.values(data);

  pieChart.update();
}


const piectx = document.getElementById('pie-chart').getContext('2d');
pieChart = new Chart(piectx, pieChartConfig);

// Load CSV data for the pie chart
Papa.parse('../data/market_segment_data.csv', {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: processCSVData
});

// Event listener for the year selection dropdown
document.getElementById('year-select').addEventListener('change', function() {
  updatePieChartForYear(this.value);
});


// ------ bar chart -------
const barChartCanvas = document.getElementById('bar-chart').getContext('2d');
let barChart;

// Function to fetch and parse the CSV data
function fetchBarChartData() {
  fetch('../data/pet_spending_data.csv')
    .then(response => response.text())
    .then(csv => {
      const results = Papa.parse(csv, { header: true, dynamicTyping: true });
      const data = results.data;
      const categories = data.map(d => d.category);
      const dogData = data.map(d => d.Dog);
      const catData = data.map(d => d.Cat);

      const barChartData = {
        labels: categories,
        datasets: [
          {
            label: 'Dog Owner',
            data: dogData,
            backgroundColor: '#20836D'
          },
          {
            label: 'Cat Owner',
            data: catData,
            backgroundColor: '#D25319'
          }
        ]
      };

      const barChartOptions = {
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Category', // X-axis label
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount Spent ($)', // Y-axis label
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            onClick: (e, legendItem, legend) => {
              const index = legendItem.datasetIndex;
              const chart = legend.chart;
              chart.getDatasetMeta(index).hidden = !chart.getDatasetMeta(index).hidden;
              chart.update();
            }
          },
          title: {
            display: true,
            text: 'Dog vs. Cat Owners: Annual Spending Breakdown'
          }
        }
      };
      

      if (barChart) {
        barChart.destroy(); // Destroy the old chart instance before creating a new one
      }

      barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: barChartData,
        options: barChartOptions
      });
    })
    .catch(error => console.error('Error loading the CSV data: ', error));
}

// Initial fetch of the bar chart data
fetchBarChartData();
