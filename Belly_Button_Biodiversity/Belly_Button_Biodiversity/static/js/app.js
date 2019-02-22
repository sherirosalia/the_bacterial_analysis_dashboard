function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
   var metadataURL =  `/metadata/${sample}`;
   
   d3.json(metadataURL).then((sampleNames) => {
    
    // Use d3 to select the panel with id of `#sample-metadata`

    var selector = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    

    
    Object.entries(sampleNames).forEach(function([key, value]) {
      selector
      //Inside the loop, use d3 to append new
    // tags for each key-value in the metadata.
        .append("p")
        .text(`${key}:${value}`);
        
      });
     });  
  
}

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    //var chartsURL = "/samples/" + sample;
    var metadataURL =  `/samples/${sample}`;
    d3.json(metadataURL).then((data) => {

    // @TODO: Build a Bubble Chart using the sample data

    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values,

        colorscale: "Earth"
      }
    };

    var trace1 = [trace1];
    var layout = {
      showlegend: false,
      height: 600,
      width: 1500,
    };

    Plotly.newPlot('bubble', trace1, layout);

    // @TODO: Build a Pie Chart

    var pieData = [{
     // HINT: You will need to use slice() to grab the top 10 sample_values, 
     // otu_ids, and labels (10 each).

     values: data.sample_values.slice(0, 10),
     labels: data.otu_ids.slice(0, 10),
     hovertext: data.otu_labels.slice(0, 10),
     type: "pie",

    }];
    var pieLayout = {
      showlegend: true,
    };
    Plotly.newPlot('pie', pieData, pieLayout);   
   
    
  }

 )};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
