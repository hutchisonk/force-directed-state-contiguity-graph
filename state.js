
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = +svg.attr("width"),// - margin.left - margin.right,
    height = +svg.attr("height"),// - margin.top - margin.bottom,
    chartWidth = width - (margin.left+margin.right),
    chartHeight = height - (margin.top+margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

d3.json(url, function(error, graph) {
  if (error) throw error;

    function drawChart(data) {
          var simulation = d3.forceSimulation()
              .force("link", d3.forceLink().id(function(d) { return d.index }))
              .force("collide",d3.forceCollide( function(d){ return d.r + 2 }).iterations(2) )
              .force("charge", d3.forceManyBody())
              .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
              .force("y", d3.forceY(0))
              .force("x", d3.forceX(0))

          var link = svg.append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(data.links)
              .enter()
              .append("line");

          var node = d3.select('.flagpics').selectAll('img')
          		.data(data.nodes)
          		.enter()
          		.append('img')
              .style("left", function(d){return d.x+40+"px"})
              .style("top", function(d){return d.y+"px"})
              .attr("class", function(d){
                return "node flag flag-"+d.code;
              })
              // .attr("alt", function(d){
              //   return d.country;
              // })

              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended))
              .on("mouseover", function(d){
                   $(".tooltip").html("<p>"+d.country+"</p>");
                   $(".tooltip").addClass("lit");
                   $(".tooltip").css({"top": d3.event.pageY, "left": d3.event.pageX+5});
                   $(this).addClass("selected");

                 })//on mouseover
              .on("mouseout", function(d){
                  $(".tooltip").empty().removeClass("lit");
                  $(this).removeClass("selected");

                });

          var ticked = function() {
            //this all is getting repeatedly updated
              link
                  .attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });
              node
                  .style("left", function(d) { return (d.x+40)+"px"; })
                  .style("top", function(d) { return d.y+"px"; });
          }

          simulation
              .nodes(data.nodes)
              .on("tick", ticked);

          simulation.force("link")
              .links(data.links);


          function dragstarted(d) {
              if (!d3.event.active) simulation.alphaTarget(.2).restart();
              d.fx = d.x;
              d.fy = d.y;
          }

          function dragged(d) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
          }

          function dragended(d) {
              if (!d3.event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
          }
}
drawChart(graph);
});//d3.json
