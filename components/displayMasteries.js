import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function displayMasteriesChart(gameInfo) {
  const data = gameInfo;
  const width = 1000;
  const height = 1000;
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const pack = (data) =>
    d3
      .pack()
      .size([width - 2, height - 2])
      .padding(3)(
      d3
        .hierarchy({ children: data })
        .sum((d) => d.championPoints)
        .sort((a, b) => b.championPoints - a.championPoints)
    );
  const root = pack(data);
  let focus = root;
  let view;

  const svg = d3
    .select("#masteries-chart")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("display", "block")
    .style("margin", "0 -14px")
    .style("cursor", "pointer");

  const node = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .selectAll("g")
    .data(root.descendants().slice(1))
    .join("g")
    .attr("transform", (d) => `translate(${d.x - root.x},${d.y - root.y})`);

  node
    .append("clipPath")
    .attr("id", (d, i) => `clip-${i}`)
    .append("circle")
    .attr("r", (d) => d.r);

  node
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
    .attr("pointer-events", (d) => (!d.children ? "none" : null))
    .on("mouseover", function () {
      d3.select(this).attr("stroke", "#000");
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke", null);
    });

  node
    .append("image")
    .attr(
      "xlink:href",
      (d) =>
        `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${d.data.championName}.png`
    )
    .attr("x", (d) => -d.r)
    .attr("y", (d) => -d.r)
    .attr("height", (d) => 2 * d.r)
    .attr("width", (d) => 2 * d.r)
    .attr("clip-path", (d, i) => `url(#clip-${i})`);

  const hoverGroup = node.append("g").style("visibility", "hidden");

  hoverGroup
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", "black")
    .style("opacity", "0.6");

  hoverGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".3em")
    .text((d) => d.data.championName)
    .attr("fill", "white")
    .style("font-size", "20px");

  hoverGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em")
    .text("Points de maîtrise :")
    .attr("fill", "white");

  hoverGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "2.6em")
    .text((d) => d.data.championPoints)
    .attr("fill", "white");

  node
    .on("mouseover", function () {
      d3.select(this).select("g").style("visibility", "visible");
    })
    .on("mouseout", function () {
      d3.select(this).select("g").style("visibility", "hidden");
    });

  return svg.node();
}
