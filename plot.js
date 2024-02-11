document.addEventListener("DOMContentLoaded", function() {
    // DATA
    let categories;
    d3.csv('average_nutrients.csv').then(function(data) {
        data.forEach(function(d) {
            categories = data.map(d=>d.Category);
            d.Category = d.Category; // Assuming 'Category' is the column name in your CSV
            d.kcal = +d.Energ_Kcal;
            d.sugar = +d.Sugar_Tot_g;
            d.Protein = +d.Protein_g;
            d.Fat = +d.FA_Sat_g;
            d.CarbsWithoutSugar = +d.Carbohydrate_without_sugar_g;
    
            let nutrimentsTotal = d.Protein + d.Fat + d.sugar + d.CarbsWithoutSugar;
            d.sugarPercentage = (d.sugar / nutrimentsTotal) * 100;
            d.ProteinPercentage = (d.Protein / nutrimentsTotal) * 100;
            d.FatPercentage = (d.Fat / nutrimentsTotal) * 100;
            d.CarbsWithoutSugarPercentage = (d.CarbsWithoutSugar / nutrimentsTotal) * 100;
        });
    
        // Functions to create scales, axes, and draw the plot would be defined elsewhere
        createScales(data); // Set up scales using the modified data
        drawAxes(); // Draw chart axes
        drawRoseChart(data); // Draw rose (or other) charts using the updated data with categories
        addLegend(); // Add a legend to the chart
    });

    // Create SCALES

    let xScale, yScale;

    function createScales(data) {
         // Assuming 'Category' is a key that exists in your data,
         // and you want to plot categories on the x-axis
    xScale = d3.scaleBand()
        .domain(data.map(d => d.Category)) // Set the domain to the list of categories
        .range([0, width]) // The width of your SVG or visualization container
        .padding(0.1); // Adjust padding between bands
 
         // Adjust yScale to focus on sugar percentage
    yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sugarPercentage)]) // Adjust to sugarPercentage
        .range([height, 0]); // Keep as is for a bottom-up y-axis
        }

     
        // Set up SVG canvas
        const colorScale = d3.scaleOrdinal()
        .domain(["Protein", "Fat", "Sugar", "CarbsWithoutSugar"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);
        // Assuming this code runs after data is loaded and processed
        // Example colorScale definition
        const margin = { top: 10, right: 30, bottom: 120, left: 60 },
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

        // Correctly setting up SVG dimensions
        const svg = d3.select('#roseChart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g') // Append g for transformations
        .attr('transform', `translate(${margin.left},${margin.top})`);

        const radius = Math.min(width, height) / 2; // Define radius here

        // Then you translate to the center of the SVG for the rose chart specifically
        const g = svg.append('g')
        .attr('transform', `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

        // Scales definition should be correct here, assuming data is processed
        const rScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max([d.ProteinPercentage, d.FatPercentage, d.sugarPercentage, d.CarbsWithoutSugarPercentage]))])
        .range([0, radius]);

       


        // Create the arcs for the rose chart
        const angleStep = (Math.PI * 2) / data.length;

        // DRAW AXES
        function drawAxes() {
            // Ensure svg is correctly selected, especially if it's within a specific DOM element
            const svg = d3.select('#roseChart').select('g'); // Adjust selector as necessary
        
            // Append the x-axis to the svg
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(xScale));
        
            // Append the y-axis to the svg
            svg.append('g')
                .call(d3.axisLeft(yScale));
        
            // X-axis label
            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('x', width / 2)
                .attr('y', height + margin.top + 20) // Adjust for better positioning
                .text('Category'); // Label based on what xScale represents
        
            // Y-axis label
            svg.append('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
                .attr('y', -margin.left + 20)
                .attr('x', -height / 2)
                .text('Sugar Percentage'); // Label based on what yScale represents
        }


        
        // ROSE CHART
        function drawRoseChart(data) {
            const radius = Math.min(width, height) / 2;
            const radialScale = d3.scaleLinear()
                .domain([0, 100]) // Update this according to your data's max value
                .range([0, radius]);
        
            const angleScale = d3.scaleBand()
                .domain(data.map((d, i) => i))
                .range([0, 2 * Math.PI]);
        
            // Assuming 'g' is already correctly appended to your SVG with the right transformation
            data.forEach((d, i) => {
                // Loop through each nutrient for each data point to create segments
                categories.forEach((category, index) => {
                    // Calculate start and end angles
                    const startAngle = angleScale(i);
                    const endAngle = startAngle + angleScale.bandwidth();
        
                    const path = d3.arc()
                        .innerRadius(0)
                        .outerRadius(radialScale(d[category])) // Use radialScale to determine the outerRadius based on the data's value
                        .startAngle(startAngle)
                        .endAngle(endAngle);
        
                    g.append('path')
                        .attr('d', path)
                        .attr('fill', colorScale(category)) // Use colorScale to color each segment based on the category
                        .on('mouseover', function(event, d) {
                            // Update tooltip content and position
                        })
                        .on('mouseout', function() {
                            // Hide tooltip
                        });
                });
            });
        
            // Legend setup corrected to match the placement and structure
            createLegend(categories, colorScale);
        }
        
        function createLegend(categories, colorScale) {
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width - 120}, ${20})`);
        
            categories.forEach((category, index) => {
                const legendRow = legend.append("g")
                    .attr("transform", `translate(0, ${index * 20})`);
        
                legendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", colorScale(category));
        
                legendRow.append("text")
                    .attr("x", 15)
                    .attr("y", 10)
                    .text(category); // Update to match your category names
            });
        }
        
        
        // LEGEND
        function addLegend(svg) {
            // Correctly define your categories with appropriate colors
            const categories = [
                { name: "Protein", color: "blue" },
                { name: "Fat", color: "pink" },
                { name: "Sugar", color: "yellow" },
                { name: "Carbs (w/o sugar)", color: "green" }
            ];
        
            const legendSpacing = 20; // Space between legend items
            const legendRectSize = 10; // The size of the legend marker
            const legendXOffset = 50; // X offset from the chart
            const legendYOffset = 10; // Starting Y offset
        
            // Creating a legend container to manage positioning more easily
            const legendContainer = svg.append('g')
                .attr('class', 'legend-container')
                .attr('transform', `translate(${legendXOffset},${legendYOffset})`);
        
            const legend = legendContainer.selectAll('.legend') // Select all legends
                .data(categories)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', (d, i) => `translate(0,${i * (legendRectSize + legendSpacing)})`);
        
            // Drawing the colored rectangles
            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', d => d.color)
                .style('stroke', d => d.color);
        
            // Adding the text labels
            legend.append('text')
                .attr('x', legendRectSize + 5)
                .attr('y', legendRectSize / 2)
                .attr('dy', '.35em') // Vertically center align the text
                .text(d => d.name)
                .style('font-size', '12px'); // Adjust font size as needed
        }
        



});