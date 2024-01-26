import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function displayWinrateChart(gameInfo) {
  const data = [gameInfo[0].wins, gameInfo[0].losses].sort((a, b) => b - a);
  const color = d3.scaleOrdinal(["#3C91E6", "#FF4B3E"]);
  const pie = d3.pie();
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(300, 300) / 2);

  const svg = d3
    .select("#winrate-chart")
    .attr("width", 300)
    .attr("height", 300)
    .append("g")
    .attr("transform", "translate(" + 300 / 2 + "," + 300 / 2 + ")");

  const g = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("fill", (d, i) => color(i))
    .transition()
    .duration(1000)
    .attrTween("d", function (d) {
      const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arc(d);
      };
    });

  g.append("text")
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function (d) {
      return (
        Math.round(((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100) + "%"
      );
    });

  g.append("text")
    .attr("transform", function (d) {
      return (
        "translate(" +
        arc.centroid(d)[0] +
        "," +
        (arc.centroid(d)[1] + 20) +
        ")"
      );
    })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function (d, i) {
      return i === 0 ? "Victoires" : "Défaites";
    });
}
