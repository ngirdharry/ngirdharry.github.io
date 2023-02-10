// json url 
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Retrieve Json data and create function to pull ID numbers from dropdown tab
d3.json(url).then(function(data) {
  let values = Object.values(data);
  samples=values[2]
  for (let i = 0; i < samples.length; i++) {
    sample = samples[i];
    let dropdownMenu = d3.select("#selDataset")
    let new_option = dropdownMenu.append("option").text(sample.id)
  };
});

// Create function to build charts
function optionChanged(value) {
  plotter(value)
};

function init() {
  plotter("940")
}; 

function plotter(sample_id) {
  d3.json(url).then(function(data) {

    let values = Object.values(data);
    samples=values[2];
    metadata=values[1];

    // Define/Identify variables

    for (let i = 0; i < samples.length; i++) {
      
      sample=samples[i]
      
      if (sample.id == sample_id) {
        
        var otu_ids = sample.otu_ids;
        var sample_values = sample.sample_values;
        var otu_labels = sample.otu_labels;

        var yticks = otu_ids.slice(0, 10).map(item => `OTU ${item}`).reverse();
        var xticks = sample_values.slice(0, 10).reverse();
        var labels = otu_labels.slice(0, 10).reverse();

        console.log(yticks);
        console.log(xticks);
        console.log(labels);

        // Build a bar chart 
        var trace1 = {
            x: xticks,
            y: yticks,
            mode: 'markers', 
            text: labels,
            orientation: 'h',
            type: 'bar'
        };

        var data = [trace1] 

        var layout = {
            title: '10 Abdundant OTUs'
        };
        
        Plotly.newPlot('bar', data, layout);

        // Build a bubble chart 
        var xticksbub = otu_ids;
        var yticksbub = sample_values;
        var labelsbub = otu_labels;

        console.log(xticksbub);
        console.log(labelsbub);
        console.log(yticksbub);

        // plots data
        var trace1 = {
            x: xticksbub,
            y: yticksbub,
            mode: 'markers',
            marker: {
              color: xticksbub,  
              size: yticksbub,
              colorscale: "Earth"
            },
            text: labelsbub
          };
          
        var data = [trace1];
        
        var layout = {
          title: 'OTUs',
          xaxis: {
              title: "OTU ID"
          },
          showlegend: false,
          height: 600,
          width: 1200
        };
        
        Plotly.newPlot('bubble', data, layout);
        
        // Create demographic chart
        var demographic_info = metadata.filter(item => item.id == sample_id);

        console.log(demographic_info);

        var result_info = demographic_info[0];

        // define all demografic variables

        var age = result_info.age;
        var bbtype = result_info.bbtype;
        var ethnicity = result_info.ethnicity;
        var gender = result_info.gender;
        var id = result_info.id;
        var location = result_info.location;
        var wfreq = result_info.wfreq;

        // create readable formating
        var demoinfo = ` id: ${id} <br> ethnicity: ${ethnicity} <br> gender: ${gender} <br> age: ${age} <br> location: ${location} <br> bbtype: ${bbtype} <br> wfreq: ${wfreq}`
        d3.select("#sample-metadata").html(demoinfo); 
        
        // Wash frequency 
        var data = [
          {
          //   domain: { x: [0, 1], y: [0, 1] },
          
            title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number+delta",
            value: wfreq,
            colorscale: 'Earth', 
          
            gauge: {
              axis: { range: [null, 9], ticks: 9},
              steps: [
                { range: [0, 1], color: "cyan" },
                { range: [1, 2], color: "lightblue" },
                { range: [2, 3], color: "aquamarine" },
                { range: [3, 4], color: "darkseagreen" },
                { range: [4, 5], color: "darkcyan" },
                { range: [5, 6], color: "green" },
                { range: [6, 7], color: "darkgreen" },
                { range: [7, 8], color: "rebeccapurple" },
                { range: [8, 9], color: "darkred" }
              ],
              threshold: {
                line: { color: "crimson", width: 3 },
                thickness: 1.0,
                value: wfreq
              }
            }
          }
        ];
        
        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 }, paper_bgcolor: "gainsboro" };
        Plotly.newPlot('gauge', data, layout);
  }
  }
  })
}; 

init();
