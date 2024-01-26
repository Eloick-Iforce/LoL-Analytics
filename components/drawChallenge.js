import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function drawChallengeProgress(challenge) {
  let challengeData = challenge.categoryPoints;

  let data = Object.keys(challengeData).map((category) => {
    return {
      category: category,
      progress: challengeData[category].current / challengeData[category].max,
    };
  });

  let yScale = d3.scaleLinear().domain([0, 1]).range([0, 500]);

  let xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.category))
    .range([0, 1300])
    .padding(0.3);

  let colorScale = d3
    .scaleOrdinal()
    .domain(["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"])
    .range(["#cd7f32", "#c0c0c0", "#ffd700", "#508AA8", "#92BCEA"]);

  let svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", 1400)
    .attr("height", 600);

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.category))
    .attr("y", 500)
    .attr("width", xScale.bandwidth())
    .attr("height", 0)
    .attr("fill", (d) => colorScale(challengeData[d.category].level))
    .transition()
    .duration(1000)
    .attr("y", (d) => 500 - yScale(d.progress))
    .attr("height", (d) => yScale(d.progress));

  svg
    .selectAll(".current-points")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "current-points")
    .attr("x", (d) => xScale(d.category) + xScale.bandwidth() / 2)
    .attr("y", (d) => 500 - yScale(d.progress) + 20)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text((d) => challengeData[d.category].current);

  svg
    .selectAll(".max-points")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "max-points")
    .attr("x", (d) => xScale(d.category) + xScale.bandwidth() / 2)
    .attr("y", (d) => 500 - yScale(1) + 20)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text((d) => challengeData[d.category].max);

  svg
    .selectAll(".category-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "category-label")
    .attr("x", (d) => xScale(d.category) + xScale.bandwidth() / 2)
    .attr("y", 520)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text((d) => d.category);

  let legend = svg
    .selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + 20 * i + ")";
    });

  legend
    .append("rect")
    .attr("x", 1300)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  legend
    .append("text")
    .attr("x", 1320)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .style("fill", "white")
    .text(function (d) {
      return d;
    });
}
