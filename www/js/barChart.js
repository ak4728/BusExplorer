/**
#
# DOT Time Tool, based on Pluto data viewer
#
*/

bus.BarChart = function(){
    // creates chart and dim
    var chart = undefined;
    var cdim  = undefined;
    var parent = undefined;

    // chart size
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    var width  = 380 - margin.left - margin.right;
    var height = 190 - margin.top - margin.bottom;

    // bins creation variables
    var max = 0;
    var min = 0;

    // exported api
    var exports = {};

    // creates the dc.js chart
    function createChart(parentDiv,data1,data2){
        console.log(data1,data2);
        var m = 2;
        var n = 0;
        for(var i=0; i<data1.length; i++) {
            n = Math.max(n,data1[i].segment);
        }
        for(var i=0; i<data2.length; i++) {
            n = Math.max(n,data2[i].segment);
        }
        n = n+1;

        var data = d3.range(m).map(function() {return d3.range(n).map(function(){return 0})});
        for(var i=0; i<data1.length; i++) {
            var segment = data1[i].segment;
            var avgSpeed = data1[i].avgSpeed;
            data[0][segment]+=avgSpeed;
        }
        for(var i=0; i<data2.length; i++) {
            var segment = data2[i].segment;
            var avgSpeed = data2[i].avgSpeed;
            data[1][segment]+=avgSpeed;
        }
        console.log(data);
        // var data = d3.range(m).map(function() { return d3.range(n).map(Math.random); });

        var y = d3.scale.linear()
            .domain([0, 80])
            .range([height, 0]);

        var x0 = d3.scale.ordinal()
            .domain(d3.range(n))
            .rangeBands([0, width], .2);

        var x1 = d3.scale.ordinal()
            .domain(d3.range(m))
            .rangeBands([0, x0.rangeBand()]);

        var z = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        parent = parentDiv.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        var svg = parent.append("svg:g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g").selectAll("g")
            .data(data)
          .enter().append("g")
            .style("fill", function(d, i) { return z(i); })
            .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
          .selectAll("rect")
            .data(function(d) { return d; })
          .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("height", y)
            .attr("x", function(d, i) { return x0(i); })
            .attr("y", function(d) { return height - y(d); });
    }

    exports.saveImage = function(){
        console.log("Saving image");
        var html = parent.attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

        var canvas = document.createElement("canvas");
        canvas.width = width + margin.left + margin.right;
        canvas.height = height + margin.top + margin.bottom;
        var context = canvas.getContext("2d");

        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
        var img = new Image();
        img.onload = function() {
            console.log("onload");
            context.drawImage(img, 0, 0);

            var canvasdata = canvas.toDataURL("image/png");

            var a = document.createElement("a");
            a.download = "sample.png";
            a.href = canvasdata;
            a.click();
        };
        img.src = imgsrc;

    };

    // histogram construction
    exports.create = function(parentDiv,data1, data2){
        createChart(parentDiv,data1,data2);
    };

    // exported api
    return exports;
};