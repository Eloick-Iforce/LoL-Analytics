const apiKey = ""; //API KEY HERE

export function getPUUID(gameName, tagLine) {
  return fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => data);
}

export function getSummonerInfo(puuid) {
  return fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => data);
}

export function getSummonerRank(summonerID) {
  return fetch(
    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => data);
}

export function getMasteries(puuid) {
  return fetch(
    `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => data);
}

export function getChampName() {
  return fetch(
    `https://ddragon.leagueoflegends.com/cdn/14.1.1/data/fr_FR/champion.json`
  )
    .then((res) => res.json())
    .then((data) => data);
}

export function getChallenge(puuid) {
  return fetch(
    `https://euw1.api.riotgames.com/lol/challenges/v1/player-data/${puuid}?api_key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => data);
}

export function getHistory(puuid) {
  return fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=3&api_key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => data);
}

export function getMatchInfo(matchId) {
  return fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => data);
}
