import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function displayMatchHistory(
  history,
  accountData,
  champNames,
  gameName
) {
  const container = d3.select("#history");

  container
    .append("h1")
    .text("Ses 3 dernières parties :")
    .attr("class", "text-2xl font-bold mt-4");

  history.forEach((match) => {
    const playerIndex = match.metadata.participants.indexOf(accountData.puuid);

    if (playerIndex !== -1) {
      const championId = match.info.participants[playerIndex].championId;
      const championName = champNames[championId];
      const championImage = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`;

      const isWin = match.info.participants[playerIndex].win;
      const bgColorClass = isWin ? "bg-blue-500" : "bg-red-500";

      const matchDiv = container
        .append("div")
        .attr(
          "class",
          `p-4 m-2 border rounded shadow-lg flex gap-8 items-center ${bgColorClass}`
        );

      matchDiv
        .append("img")
        .attr("src", championImage)
        .attr("alt", championName)
        .attr("class", "w-32 h-32");

      const matchInfoDiv = matchDiv.append("div").attr("class", "mt-4");

      matchInfoDiv
        .append("h2")
        .text(`${gameName}`)
        .attr("class", "text-xl font-bold");

      const seconds = match.info.gameDuration;
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      matchInfoDiv
        .append("p")
        .text(
          `Durée de la partie : ${minutes} minutes ${remainingSeconds} secondes`
        )
        .attr("class", "mt-2");

      matchInfoDiv
        .append("p")
        .text(
          `Nombre de cs : ${match.info.participants[playerIndex].totalMinionsKilled}`
        )
        .attr("class", "mt-2");

      matchInfoDiv
        .append("p")
        .text(`Nombre de kills : ${match.info.participants[playerIndex].kills}`)
        .attr("class", "mt-2");

      matchInfoDiv
        .append("p")
        .text(
          `Nombre de morts : ${match.info.participants[playerIndex].deaths}`
        )
        .attr("class", "mt-2");
    }
  });
}
