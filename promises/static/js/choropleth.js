var colors = {
    Blues:[ '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    Reds:[ '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    Greens:[ '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b' ]};


function easy_choropleth(config){ 

        var margin = {top: 20, right: 20, bottom: 20, left: 20}, 
            width = config.width,
            height = config.height;

        var quantize = d3.scale.quantize()
            .domain([100, 300])
            .range(config.colors);

        var data = {};

        queue()
            .defer(d3.json, config.datasource)
            //.defer(d3.csv, "data.csv")
            .await(ready);
   // TODO sync it with our html template!
        var svg = d3.select("body").select(config.selector)
            .attr("width", width)
            .attr("height", height);


        function ready(error, uk) {
          

          config.data.forEach(function(o,i){
            o.value = parseFloat(o.value);
            data[o.name] = o.value;
          });

          quantize 
            .domain(d3.extent(d3.values(data), function(d){ return d;}));
        //console.log(data);

          var states = topojson.object(uk, uk.objects.oblasti);
  var projection = d3.geo.albers()
             .center([18, 42])
             .rotate([-14, 0])
             .parallels([30, 40])
             .scale(3000)
             .translate([width / 2, height]);


          var path = d3.geo.path()
            .projection(projection)
            .pointRadius(2);

          svg.selectAll(".states")
            .data(topojson.object(uk, uk.objects.oblasti).geometries)
          .enter().append("path")
            .attr("d", path)
            .style({
                  'fill': function(d) { var name = d.properties.name; return quantize(data[name]);},
                  'stroke': '#fff',
                  'stroke-dasharray': '1,3',
                  'stroke-linejoin': 'round',
                  'stroke-width': '0.5px' 
            })
     }
}

easy_choropleth({
        colors: colors.Blues,
        width: 960,
        height: 600,    
        datasource: "oblasti.topo.json",
        data: [{name:'', id:'', value:0}],
        selector: "#map_svg" 

});

