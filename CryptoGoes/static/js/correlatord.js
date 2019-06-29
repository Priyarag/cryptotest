
console.log("Script is here");


function respond_to_submit() {
    d3.event.preventDefault();
    console.log("Your button is reacting");
    var userSelectedCrypto1 = d3.select("#firstCurrency").node().value;
    var userSelectedCrypto2 = d3.select("#secondCurrency").node().value;
    var userSelectedDateTime1 = d3.select("#firstDateTime").node().value;
    var userSelectedDateTime2 = d3.select("#secondDateTime").node().value;
    console.log(userSelectedCrypto1);
    console.log(userSelectedDateTime1);

    buildPlot(userSelectedCrypto1, userSelectedCrypto2, userSelectedDateTime1, userSelectedDateTime2);
};



function buildPlot(userSelectedCrypto1, userSelectedCrypto2, userSelectedDateTime1, userSelectedDateTime2) {

    var corr_data_fetch_url = `/livedata/${userSelectedCrypto1}/${userSelectedCrypto2}/${userSelectedDateTime1}/${userSelectedDateTime2}`;

    array1 = []
    array2 = []
    array3 = []
    array4 = []

    d3.json(corr_data_fetch_url).then(function(results1) {
        console.log(results1); 
        while (results1.length > 0) {
            results1Chunked = results1.splice(0,3);
            array1.push(results1Chunked);
            // console.log(array1);
            };
        nArrays = array1.length;


    // slice the last three values off the datetimes for each sub-array
    // create new array of arrays with the updated values
        for (var i = 0; i < array1.length; i++){
            var entry = array1[i];
            // console.log(entry);
            subarray = [];
            for (var j = 0; j < entry.length; j++){
                if (j % 2 === 2) {
                    var item = entry[j];
                    subarray.push(item)
                }
                else if (j % 2 === 1) {
                    var item = entry[j];
                    subarray.push(item)
                }
                else {
                    var item = entry[j].slice(0,-3)
                    subarray.push(item)
                }
             //   console.log(item)
            }
            array2.push(subarray)
        };
    
    array3 = array2.splice(0,3);

    // take the new array of arrays, and remove duplicate arrays
    // based on their datetime values and their symbols
    var datetimechecker
    for (var i = 0; i < array2.length; i++){
        var entry = array2[i];
        // console.log(entry);
        subarray2 = [];
        for (var j = 0; j < entry.length; j++){
            if (j % 2 === 2) {
                var item1 = entry[j];
                subarray2.push(item1)
            }
            else if (j % 2 === 1) {
                var item2 = entry[j];
                subarray2.push(item2)
            }
            else {
                var item3 = entry[j];
                subarray2.push(item3);
            }};
        if (datetimechecker !== item3){
            array4.push(subarray2);
            datetimechecker = item3
        }
    };
    console.log(array4);

    // array4 now contains subarrays from only the unique datetimes.
    // I need to cut the array in two, so I have two arrays. Then, 
    // I need to merge the arrays on datetime, so each subarray has 5
    // values. I also need to add keys for each item in each subarray.

    array5 = []
    array6 = []
  
    var myset = new set(subarray);
    myset.forEach(function(item){


    })

    // array4['symbol']=subarray[0]
    // OH! I could just create a new array.
    for (var i = 0; i < array4.length; i++){
        var entry = array4[i];
        console.log(entry);
        subarray3 = {};
        for (var j = 0; j < entry.length; j++){
            if (j % 2 === 2) {
                var item1 = entry[j];
                subarray["symbol"] = item1
                subarray3.push(item1)
            }
            else if (j % 2 === 1) {
                var item2 = entry[j];
                subarray["price"] = item2
                subarray3.push(item2)
            }
            else {
                var item3 = entry[j];
                subarray["datetime"] = item3
                subarray3.push(item3);
            }
            array5.push(subarray3);
        };};


    // testy1 = array1.concat(array2)



    // console.log(testy1);
        // var results1Prices = array1.slice(1);
        //     console.log(results1Prices)


        // var results1_fetched_datetimes = results1[2];
        // var results1_fetched_name = results1[0];
        // dict1["first_symbol_price"] = results1_fetched_price;
        // dict1["first_symbol_timestamp"] = results1_fetched_datetimes;
        // dict1["first_symbol"] = results1_fetched_name;

        // var results2_fetched_price = results2[1];
        // var results2_fetched_datetimes = results2[2];
        // var results2_fetched_name = results2[0];
        // dict2["second_symbol_price"] = results2_fetched_price;
        // dict2["second_symbol_timestamp"] = results2_fetched_datetimes;
        // dict2["second_symbol"] = results2_fetched_name; 


        var first_timepoint = dict1['timestamp'][0];
        var last_timepoint = dict1['timestamp'][-1];

        var trace1 = {
            x: dict1["timestamp"],
            y: dict1["first_symbol_price"],
            mode: "lines",
            type: "scatter",
        };
        var trace2 = {
            x: dict1["timestamp"],
            y: dict1["second_symbol_price"],
            mode: "lines",
            type: "scatter",
        };
        var trace3 = {
            x: dict1["first_symbol_price"],
            y: dict1["second_symbol_price"],
            mode: "markers",
            type: "scatter",
        };
        var trace4 = {
            y: dict1["first_symbol_price"],
            type: "box"
        };
        var trace5 = {
            y: dict1["second_symbol_price"],
            type: "box"
        };


        lineplot_data = [trace1,trace2];
        scatterplot_data = [trace3];
        boxplots_data = [trace4,trace5];

        lineplot_layout = {
            margin: {   
                t: 25, 
                b: 40, 
                }, 
            title: `${userSelectedDateTime1} to ${userSelectedDateTime2}`,
            xaxis: {
                title: {
                    text: "Minutes"
                },
                range: [first_timepoint, last_timepoint],
                type: "DateTime"
            },
    
            yaxis: {
                title: {
                    text: 'Exchange Rate (to Bitcoin)'
                }, 
                autorange: true,
                type: "linear"
            }
        };

        scatterplot_layout = {
            margin: {   
                t: 25, 
                b: 40, 
                }, 
            title: `${userSelectedDateTime1} to ${userSelectedDateTime2}`,
            xaxis: {
                title: {
                    text: `${userSelectedCrypto1}`
                },

            },
    
            yaxis: {
                title: {
                    text: `${userSelectedCrypto2}`
                }, 
            }
        };


        Plotly.newPlot("lineplot", lineplot_data, lineplot_layout);
        Plotly.newPlot("scatterplot", scatterplot_data, scatterplot_layout);
        Plotly.newPlot("boxplots", boxplots_data);
});

};
d3.selectAll("#submit").on("click", respond_to_submit);