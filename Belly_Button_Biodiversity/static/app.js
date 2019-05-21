

  // @TODO: Complete the following function that builds the metadata panel

    function buildMetadata(sample) {
      // Use d3 to select the panel with id of `#sample-metadata`
      var metadataSelector = d3.select('#sample-metadata');
  
      d3.json(`/metadata/${sample}`).then( data =>{
        // Use `.html("") to clear any existing metadata
        metadataSelector.html("");
        console.log(Object.entries(data));
        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(data).forEach(([key,value]) =>{
          metadataSelector
            .append('p').text(`${key} : ${value}`)
            .append('hr')
        });
        })
  }

    
  function pieChart(data) {
    console.log(data);
    let labels = data.otu_ids.slice(0,10);
    let values = data.sample_values.slice(0,10);
    let hovertext = data.otu_labels.slice(0,10);

    let trace = [{
      values : values,
      labels : labels,
      type : "pie",
      textposition: "inside",
      hovertext : hovertext, 
      
    }];

    let layout = {
        title: '<b> Belly Button Pie Chart </b>',
        colorway : [
          '#0c3383', '#800080','#0a88ba', '#8fbc8f', '#f2d338', '#f28f38', '#d91e1e']
    };

    Plotly.newPlot('pie', trace , layout, {responsive: true});
}

function bubbleChart(data) {
  let x = data.otu_ids;
  let y = data.sample_values;
  let markersize = data.sample_values;
  let markercolors = data.otu_ids;
  let textvalues = data.otu_labels;

  let trace =[{
    x: x,
    y: y,
    mode: 'markers',
    marker: {
      size: markersize,
      color: markercolors,
      colorscale: 'Portland'
    },
    text: textvalues
  }];

  let layout ={
    title:"<b> Belly Button Bubble Chart </b>",
    xaxis: {
      title: 'OTU ID',
    },
    yaxis: {
      title: 'Sample Value'
    }
  };

  Plotly.newPlot('bubble', trace, layout, {responsive: true});
}


// @TODO: Use `d3.json` to fetch the sample data for the plots
function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then( data =>{
    // @TODO: Build a Pie Chart
    pieChart(data);
    // @TODO: Build a Bubble Chart using the sample data
    bubbleChart(data);
  });



}

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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
