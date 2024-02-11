// Assuming your CSV has 'Category' and 'Value' columns
d3.csv("data/average_nutrients.csv").then(function(csvData) {
    const labels = csvData.map(d => d.Category);
    const dataValues = csvData.map(d => +d.Value); // Convert string to number
  
    const data = {
      labels: labels,
      datasets: [{
        label: 'Nutrient Dataset',
        data: dataValues,
        backgroundColor: [
          // Define your colors here, one for each category
        ],
      }]
    };
  
    const config = {
      type: 'polarArea',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Nutrient Distribution' }
        }
      },
    };
  
    new Chart(document.getElementById('yourCanvasId'), config);
  });

  const updateChart = (newData) => {
    chart.data.datasets[0].data = newData;
    chart.update();
  };
  
  // Example action to filter dataset based on a condition
  const filterData = () => {
    const filteredValues = csvData
      .filter(d => +d.Value > 50) // Example condition
      .map(d => +d.Value);
    updateChart(filteredValues);
  };
  
  // Example action to modify dataset values
  const modifyDataValues = () => {
    const modifiedValues = csvData.map(d => +d.Value * 1.1); // Increase values by 10%
    updateChart(modifiedValues);
  };
  
  