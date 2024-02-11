let margin = { top: 10, right: 30, bottom: 120, left: 60 };
let graphWidth = 1200 - margin.left - margin.right;
let graphHeight = 800 - margin.top - margin.bottom;
let dataPoints = [];
let maxEnergKcal, maxSugarTot;

function preload() {
  // Preload the CSV dataset
  loadTable('data/grouped_averages.csv', 'csv', 'header', function(table) {
    // Process the table object here
    maxEnergKcal = 0; // Initialize max kcal value
    maxSugarTot = 0; // Initialize max sugar value

    for (let i = 0; i < table.getRowCount(); i++) {
      let row = table.getRow(i);

      
      let food_group = row.getString('Food_group');
      let kcal = row.getNum('Energ_Kcal');
      let sugar = row.getNum('Sugar_Tot_(g)');
      let Protein = row.getNum('Protein_(g)');
      let Fat = row.getNum('Lipid_Tot_(g)');
      let CarbsWithoutSugar = row.getNum('Carbohydrate_without_sugar(g)');

      // //remove the row with fruit 
      // if (food_group === 'fruits') {
      //   continue;
      // }

    

      let nutrimentsTotal = Protein + Fat + sugar + CarbsWithoutSugar;
      let sugarPercentage = (sugar / nutrimentsTotal) * 100;
      let ProteinPercentage = (Protein / nutrimentsTotal) * 100;
      let FatPercentage = (Fat / nutrimentsTotal) * 100;
      let CarbsWithoutSugarPercentage = (CarbsWithoutSugar / nutrimentsTotal) * 100;


      // Update max values
      if (kcal > maxEnergKcal) {
        maxEnergKcal = kcal;
      }
      if (sugar > maxSugarTot) {
        maxSugarTot = sugar;
      }

      dataPoints.push({

        kcal: kcal,
        sugar: sugar,
        Protein: Protein,
        Fat: Fat,
        CarbsWithoutSugar: CarbsWithoutSugar,
        sugarPercentage: sugarPercentage,
        ProteinPercentage: ProteinPercentage,
        FatPercentage: FatPercentage,
        CarbsWithoutSugarPercentage: CarbsWithoutSugarPercentage,
        name : food_group





      });
    }

  
    
  });
}

function setup() {
  createCanvas(1400, 1000);
  noLoop();
}

function draw() {
  background(255);
  translate(margin.left, height - margin.bottom);
  drawAxis();
  plotPoints();
  push();
  resetMatrix();  // Resets the transformation matrix
  addLabelColor();
  pop();
  


}

function drawAxis() {
  stroke(0);
  strokeWeight(1);

  // Y Axis
  line(0, 0, 0, -graphHeight);

  // X Axis
  line(0, 0, graphWidth, 0);

  // Add axis labels
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);
  fill(0);

  // X Axis Label
  text('Energ_Kcal', graphWidth / 2, margin.bottom / 2);

  // Y Axis Label
  push();
  translate(-margin.left / 2, -graphHeight / 2);
  rotate(-HALF_PI);
  text('Sugar_Tot_(g)', 0, 0);
  pop();
}

function RoseChart(x, y, sugar, Protein, Fat, CarbsWithoutSugar) {
  this.x = x;
  this.y = y;
  this.sugar = sugar;
  this.Protein = Protein;
  this.Fat = Fat;
  this.CarbsWithoutSugar = CarbsWithoutSugar;

  this.render = function() {
    let nutrients = [this.sugar, this.Protein, this.Fat, this.CarbsWithoutSugar];
    let maxAngle = 360 / nutrients.length; // Equal angle for each segment

    push();
    translate(this.x, this.y);
    noStroke();

    for (let i = 0; i < nutrients.length; i++) {
      let radius = sqrt(nutrients[i]) * 15; // Adjust radius calculation as needed

      // Assign color based on nutrient index
      if (i === 0) fill(255, 0, 0, 100); // Red for sugar
      else if (i === 1) fill(0, 255, 0, 100); // Green for protein
      else if (i === 2) fill(0, 0, 255, 100); // Blue for fat
      else if (i === 3) fill(255, 0, 255, 100); // Purple for CarbsWithoutSugar

      // Calculate start and end angles
      let startAngle = radians(maxAngle * i);
      let endAngle = radians(maxAngle * (i + 1));

      arc(0, 0, radius * 2, radius * 2, startAngle, endAngle); // Adjusted for proper sizing
    }

    pop();
  };
}


function plotPoints() {
  // Loop through dataPoints to plot rose charts instead of pie charts
  for (let i = 0; i < dataPoints.length; i++) {
    let x = map(dataPoints[i].kcal, 0, maxEnergKcal, 0, graphWidth);
    let y = map(dataPoints[i].sugar, 0, maxSugarTot, 0, -graphHeight);
    let roseChart = new RoseChart(x, y, dataPoints[i].sugarPercentage, dataPoints[i].ProteinPercentage, dataPoints[i].FatPercentage, dataPoints[i].CarbsWithoutSugarPercentage);
    roseChart.render();

    // Add the name of the food group below each rose chart
    fill(0);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(dataPoints[i].name, x, y + 55); // Adjusted for rose chart radius
  }
}



function addLabelColor() {
  //add the legend for the pie chart
  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);
  fill(255, 0, 0, 100);
  text('Sugar', 1000, 100);
  ellipse(980, 100, 10, 10);

  fill(0, 255, 0, 100);
  text('Protein', 1000, 120);
  ellipse(980, 120, 10, 10);
  
  fill(0, 0, 255, 100);
  text('Fat', 1000, 140);
  ellipse(980, 140, 10, 10);
  
  fill(250, 0, 250, 100);
  
  text('CarbsWithoutSugar', 1000, 160);
  ellipse(980, 160, 10, 10);


  

}


```
```







