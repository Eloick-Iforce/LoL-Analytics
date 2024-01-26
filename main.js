import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {
  getPUUID,
  getSummonerInfo,
  getSummonerRank,
  getMasteries,
  getChampName,
  getChallenge,
  getHistory,
  getMatchInfo,
} from "./api.js";
import { displayWinrateChart } from "./components/displayWinrate.js";
import { displayMasteriesChart } from "./components/displayMasteries.js";
import { drawChallengeProgress } from "./components/drawChallenge.js";
import { displayMatchHistory } from "./components/displayMatchHistory.js";

const container = d3.select("#d3-container");

d3.select("#search-form").on("submit", function (event) {
  event.preventDefault();

  const gameName = d3.select("#game-name").property("value");
  const tagLine = d3.select("#tag-line").property("value");
  displayData(gameName, tagLine);
});

async function displayData(gameName, tagLine) {
  container.html("");

  const accountData = await getPUUID(gameName, tagLine);
  const summonerData = await getSummonerInfo(accountData.puuid);
  const rankandwin = await getSummonerRank(summonerData.id);
  const challenge = await getChallenge(accountData.puuid);
  let masteries = await getMasteries(accountData.puuid);
  const championsData = await getChampName();
  let history = await getHistory(accountData.puuid);
  history = await Promise.all(
    history.map(async (matchId) => {
      return await getMatchInfo(matchId);
    })
  );

  console.log(summonerData);

  const champNames = Object.values(championsData.data).reduce((map, champ) => {
    map[champ.key] = champ.id;
    return map;
  }, {});

  masteries = masteries.map((mastery) => {
    mastery.championName = champNames[mastery.championId];
    return mastery;
  });

  const ProfileContainer = container
    .append("div")
    .attr("class", "flex items-center gap-4");

  ProfileContainer.append("img")
    .attr(
      "src",
      `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/profileicon/${summonerData.profileIconId}.png`
    )
    .attr("alt", "profile icon")
    .attr("class", "w-32 h-32 mt-4 rounded-full");

  const textContainer = ProfileContainer.append("div");

  textContainer
    .append("h1")
    .text(`Nom du joueur : ${summonerData.name}`)
    .attr("class", "text-2xl font-bold mt-4");

  textContainer
    .append("p")
    .text(`Niveau : ${summonerData.summonerLevel}`)
    .attr("class", "text-lg mt-1");

  container
    .append("h2")
    .text("Progressions des défis :")
    .attr("class", "my-4 text-2xl font-bold");
  drawChallengeProgress(challenge);

  container
    .append("h2")
    .text("Winrate du joueur :")
    .attr("class", "my-4 text-2xl font-bold");

  const flexContainer = container
    .append("div")
    .attr("class", "flex justify-between");

  const winrateContainer = flexContainer.append("div");
  winrateContainer.append("svg").attr("id", "winrate-chart");
  displayWinrateChart(rankandwin);

  const historyContainer = flexContainer.append("div");
  historyContainer.append("div").attr("id", "history");
  displayMatchHistory(history, accountData, champNames, gameName);

  container
    .append("h2")
    .text("Maitrises des champions :")
    .attr("class", "my-4 text-2xl font-bold");

  container
    .append("svg")
    .attr("id", "masteries-chart")
    .attr("class", "w-full h-fit mt-4");
  displayMasteriesChart(masteries);
}
